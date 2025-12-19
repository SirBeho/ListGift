<?php

namespace App\Modules\Queue;

use App\Middlewares\RoleAccess; // Considerar si esto debe ser configurable
use App\Modules\Queue\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class Controller
{
    public function index()
    {
        try {
            $Queues = Model::all();
            header("HTTP/1.0 200 OK");
            echo json_encode($Queues);
        } catch (\Throwable $th) {
            header("HTTP/1.0 500 Internal Server Error");
            echo json_encode(['status' => 'error', 'message' => $th->getMessage()]);
        }
    }

    public function show($id)
    {
        try {
            $Queue = Model::findOrFail($id);
            header("HTTP/1.0 200 OK");
            echo json_encode($Queue);
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
                echo json_encode(['status' => 'error', 'message' => 'Queue already exists']);
                return;
            }
            $Queue = Model::create($_POST);
            header("HTTP/1.0 201 Created");
            echo json_encode(['status' => 'success', 'message' => 'Queue created successfully']);
        } catch (\Throwable $th) {
            header("HTTP/1.0 500 Internal Server Error");
            echo json_encode(['status' => 'error', 'message' => $th->getMessage()]);
        }
    }

    public function update($id)
    {
        try {
            RoleAccess::admin(); // Considerar si esto debe ser configurable
            $Queue = Model::findOrFail($id);
            $Queue->update($_POST);
            header("HTTP/1.0 200 OK");
            echo json_encode(['status' => 'success', 'message' => 'Queue updated successfully']);
        } catch (ModelNotFoundException $th) {
            header("HTTP/1.0 404 Internal Server Error");
            echo json_encode(['status' => 'error', 'message' => $th->getMessage()]);
        }
    }

    public function destroy($id)
    {
        try {
            RoleAccess::admin(); // Considerar si esto debe ser configurable
            $Queue = Model::findOrFail($id);
            $Queue->delete();
            echo json_encode(['status' => 'success', 'message' => 'Queue deleted successfully']);
        } catch (ModelNotFoundException $th) {
            echo json_encode(['status' => 'error', 'message' => $th->getMessage()]);
        }
    }
}