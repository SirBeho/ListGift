<?php

namespace App\Modules\List;

use App\Middlewares\RoleAccess; // Considerar si esto debe ser configurable
use App\Modules\Auth\AuthHelper;
use App\Modules\List\Model;
use App\Services\ImageManager;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Utils\Validator;

class Controller
{
    public function index()
    {
        try {
            $Lists = Model::with('items', 'user')->where('is_public', true)->get(); 
            header("HTTP/1.0 200 OK");
            echo json_encode([
                'status' => 'success',
                'lists' => $Lists
            ]);
        } catch (\Throwable $th) {
            header("HTTP/1.0 500 Internal Server Error");
            echo json_encode(['status' => 'error', 'message' => $th->getMessage()]);
        }
    }

    public function show($id)
    {
        try {
            //admin, owner o public
            $List = Model::findOrFail($id);
            if (!$List->is_public) {
                RoleAccess::checkOwner($List);
            } 

            header("HTTP/1.0 200 OK");
            echo json_encode($List);
        } catch (ModelNotFoundException $th) {
            header("HTTP/1.0 404 Not Found");
            echo json_encode($th->getMessage());
        }
    }

    public function store()
    {
            $validated = Validator::validate($_POST, [
                'user_id'    => 'required|integer',
                'name'        => 'required|min:3',
                'description' => 'required|min:10',
                'due_date'    => 'date',
                'color1'      => 'required|hex',
                'color2'      => 'required|hex',
                'is_public'   => 'boolean',
                'icon'        => 'string',
            ]);
       
        try {

            $imageName = ImageManager::upload($_FILES['image'] ?? null, 'list');
            if (!$imageName) {
                $imageName = ImageManager::getImageForCategory($validated['name'],$validated['color2']);
            }
            $validated['image'] = $imageName;

            Model::create($validated);
    
            header("HTTP/1.0 201 Created");
            echo json_encode(['status' => 'success', 'message' => 'Lista creada']);
        } catch (\Throwable $th) {
            header("HTTP/1.0 500 Internal Server Error");
            echo json_encode(['status' => 'error', 'message' => $th->getMessage()]);
        }
    }

    public function update($id)
    {
        try {
            $List = Model::findOrFail($id);
            RoleAccess::checkOwner($List); 
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
