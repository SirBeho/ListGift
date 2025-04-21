<?php

namespace App\Modules\Lista;

use App\Middlewares\RoleAccess;
use App\Modules\Lista\Model;
use App\Utils\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Writer\Pdf\Mpdf as PdfMpdf;

class Controller
{
    public function index()
    {
        try {
            RoleAccess::student();
            $id = $_REQUEST['auth']['user'];
            $Listas = Model::where('user_id', $id)
                ->orderBy('year', 'asc')
                ->get();
            $Listas->load('subcategory', 'subcategory.category');
            header("HTTP/1.0 200 OK");
            echo json_encode($Listas);
        } catch (ModelNotFoundException $th) {
            header("HTTP/1.0 404 Not Found");
            echo json_encode($th->getMessage());
        }
    }

    public function report($id = null)
    {
        try {
            $role = ((array) $_REQUEST['auth']['role'])['name'];
            if (!$id && $role == 'Student') {
                $id = $_REQUEST['auth']['user'];
            } else {
                throw new ModelNotFoundException('id is required' . $role);
            }

            $Listas = Model::where('user_id', $id)
                ->with('subcategory', 'subcategory.category')
                ->orderBy('year', 'asc')
                ->get()
                ->groupBy('year');

            $student = Student::findOrFail($id);
            $student->load('user', 'Lista', 'user.schools');

            // Load the existing template
            $templatePath = 'src/statics/template.xlsx';
            $spreadsheet = IOFactory::load($templatePath);
            $sheet = $spreadsheet->getActiveSheet();

            $columns = ['D', 'F', 'H', 'J', 'L'];
            $subcategories_row = [6, 7, 10, 11, 12, 15, 16, 19, 20, 23, 24];

            $sheet->setCellValue('H1', $student->user->full_name);
            $sheet->setCellValue('H2', $student->user->schools[0]->name);
            $sheet->setCellValue('H3', $student->Lista->name);

            $counter = 0;
            foreach ($Listas as $year => $Listas) {
                $sheet->setCellValue($columns[$counter] . 5, $year);
                $sheet->setCellValue($columns[$counter] . 9, $year);
                $sheet->setCellValue($columns[$counter] . 14, $year);
                $sheet->setCellValue($columns[$counter] . 18, $year);
                $sheet->setCellValue($columns[$counter] . 22, $year);

                foreach ($Listas as $key => $Lista) {
                    $row = $subcategories_row[$Lista->subcategory_id - 1];
                    $sheet->setCellValue($columns[$counter] . $row, $Lista->Lista);
                }
                $counter++;
            }

            // Convert the spreadsheet to PDF 
            $pdfWriter = new PdfMpdf($spreadsheet);
            $pdfWriter->setOrientation('landscape');
            $tempPdfFile = tempnam(sys_get_temp_dir(), 'Listas') . '.pdf';
            $pdfWriter->save($tempPdfFile);

            // Return the PDF file as a response
            header('Content-Type: application/pdf');
            header('Content-Disposition: inline; filename="Listas.pdf"');
            readfile($tempPdfFile);

            // Clean up temporary files
            unlink($tempPdfFile);
        } catch (ModelNotFoundException $th) {
            header("HTTP/1.0 404 Not Found");
            echo json_encode($th->getMessage());
        }
    }

    public function store()
    {
        try {
            RoleAccess::student();
            $user = $_REQUEST['auth']['user'];
            $required = ['Lista', 'year', 'subcategory_id'];
            Validator::required($_POST, $required);

            $verify = Model::where('user_id', $user)
                ->where('year', $_POST['year'])
                ->where('subcategory_id', $_POST['subcategory_id'])
                ->first();

            if ($verify) {
                header("HTTP/1.0 400 Bad Request");
                echo json_encode(['status' => 'error', 'message' => 'Lista already exists for this year and subcategory']);
                exit();
            }

            $_POST['user_id'] = $user;

            Model::create($_POST);
            header("HTTP/1.0 201 Created");
            echo json_encode(['status' => 'success', 'message' => 'Category created successfully']);
        } catch (\Throwable $th) {
            header("HTTP/1.0 500 Internal Server Error");
            echo json_encode(['status' => 'error', 'message' => $th->getMessage()]);
        }
    }

    public function update($id)
    {
        try {
            RoleAccess::student();
            $user = $_REQUEST['auth']['user'];
            $Lista = Model::findOrFail($id);

            if ($Lista->user_id != $user) {
                header("HTTP/1.0 403 Forbidden");
                echo json_encode(['status' => 'error', 'message' => 'You are not allowed to update this Lista']);
            }

            $Lista->update($_POST);
            header("HTTP/1.0 200 OK");
            echo json_encode(['status' => 'success', 'message' => 'Category updated successfully']);
        } catch (ModelNotFoundException $th) {
            header("HTTP/1.0 404 Internal Server Error");
            echo json_encode(['status' => 'error', 'message' => $th->getMessage()]);
        }
    }

    public function listcompasses()
    {
        try {
            $start = date('Y-m-01');
            $end = date('Y-m-d', strtotime('+1 day'));

            if (isset($_GET['start'])) {
                $start = date('Y-m-d', strtotime($_GET['start']));
            }

            if (isset($_GET['end'])) {

                $end = date('Y-m-d', strtotime($_GET['end'] . ' +1 day'));
            }

            if($start > $end){
                header("HTTP/1.0 400 Bad Request");
                echo json_encode(['status' => 'error', 'message' => 'Invalid date range']);
                exit();
            }

            $Listas = Model::selectRaw('user_id, IF(COUNT(user_id) >= 55, "completed", "partial") as status')
                 ->whereBetween('created_at', [$start, $end])
                ->with('user', 'user.schools', 'user.student.Lista')
                ->groupBy('user_id')
                ->get();

            echo json_encode([
                'range' => ['start' => $start, 'end' => date('Y-m-d', strtotime($end . ' -1 day'))],
                '$compasses' => $Listas,
            ]);
        } catch (ModelNotFoundException $th) {
            header("HTTP/1.0 404 Not Found");
            echo json_encode($th->getMessage());
        }
    }
}
