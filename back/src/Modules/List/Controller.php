<?php

namespace App\Modules\List;

use App\Middlewares\RoleAccess; // Considerar si esto debe ser configurable
use App\Modules\List\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class Controller
{
    public function index()
    {
        try {
            $Lists = Model::all();
            header("HTTP/1.0 200 OK");
            echo json_encode($Lists);
        } catch (\Throwable $th) {
            header("HTTP/1.0 500 Internal Server Error");
            echo json_encode(['status' => 'error', 'message' => $th->getMessage()]);
        }
    }

    public function show($id)
    {
        try {
            $List = Model::findOrFail($id);
            header("HTTP/1.0 200 OK");
            echo json_encode($List);
        } catch (ModelNotFoundException $th) {
            header("HTTP/1.0 404 Not Found");
            echo json_encode($th->getMessage());
        }
    }

    public function store()
    {
        try {
            RoleAccess::admin(); // Considerar si esto debe ser configurable

            if (Model::where('name', $_POST['name'])->exists()) {
                header("HTTP/1.0 409 Conflict");
                echo json_encode(['status' => 'error', 'message' => 'List already exists']);
                return;
            }
            $List = Model::create($_POST);
            header("HTTP/1.0 201 Created");
            echo json_encode(['status' => 'success', 'message' => 'List created successfully']);
        } catch (\Throwable $th) {
            header("HTTP/1.0 500 Internal Server Error");
            echo json_encode(['status' => 'error', 'message' => $th->getMessage()]);
        }
    }

    public function update($id)
    {
        try {
            RoleAccess::admin(); // Considerar si esto debe ser configurable
            $List = Model::findOrFail($id);
            $List->update($_POST);
            header("HTTP/1.0 200 OK");
            echo json_encode(['status' => 'success', 'message' => 'List updated successfully']);
        } catch (ModelNotFoundException $th) {
            header("HTTP/1.0 404 Internal Server Error");
            echo json_encode(['status' => 'error', 'message' => $th->getMessage()]);
        }
    }

    public function destroy($id)
    {
        try {
            RoleAccess::admin(); // Considerar si esto debe ser configurable
            $List = Model::findOrFail($id);
            $List->delete();
            echo json_encode(['status' => 'success', 'message' => 'List deleted successfully']);
        } catch (ModelNotFoundException $th) {
            echo json_encode(['status' => 'error', 'message' => $th->getMessage()]);
        }
    }
}
