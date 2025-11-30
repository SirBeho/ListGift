<?php

namespace App\Modules\Item;

use App\Middlewares\RoleAccess;
use App\Modules\Item\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class Controller
{
    public function index()
    {
        try {
            $Item = Model::all();
            header("HTTP/1.0 200 OK");
            echo json_encode($Item);
        } catch (\Throwable $th) {
            header("HTTP/1.0 500 Internal Server Error");
            echo json_encode(['status' => 'error', 'message' => $th->getMessage()]);
        }
    }

    public function show($id)
    {
        try {
            $Item = Model::findOrFail($id);
            header("HTTP/1.0 200 OK");
            echo json_encode($Item);
        } catch (ModelNotFoundException $th) {
            header("HTTP/1.0 404 Not Found");
            echo json_encode($th->getMessage());
        }
    }

    public function store()
    {
        try {
            RoleAccess::admin();

            if (Model::where('name', $_POST['name'])->exists()) {
                header("HTTP/1.0 409 Conflict");
                echo json_encode(['status' => 'error', 'message' => 'Item already exists']);
                return;
            }
            $Item = Model::create($_POST);
            header("HTTP/1.0 201 Created");
            echo json_encode(['status' => 'success', 'message' => 'Item created successfully']);
        } catch (\Throwable $th) {
            header("HTTP/1.0 500 Internal Server Error");
            echo json_encode(['status' => 'error', 'message' => $th->getMessage()]);
        }
    }

    public function update($id)
    {
        try {
            RoleAccess::admin();
            $Item = Model::findOrFail($id);
            $Item->update($_POST);
            header("HTTP/1.0 200 OK");
            echo json_encode(['status' => 'success', 'message' => 'Item updated successfully']);
        } catch (ModelNotFoundException $th) {
            header("HTTP/1.0 404 Internal Server Error");
            echo json_encode(['status' => 'error', 'message' => $th->getMessage()]);
        }
    }

    public function destroy($id)
    {
        try {
            RoleAccess::admin();
            $Item = Model::findOrFail($id);
            $Item->delete();
            echo json_encode(['status' => 'success', 'message' => 'User deleted successfully']);
        } catch (ModelNotFoundException $th) {
            echo json_encode(['status' => 'error', 'message' => $th->getMessage()]);
        }
    }
}
