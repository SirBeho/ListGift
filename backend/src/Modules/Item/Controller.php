<?php

namespace App\Modules\Item;

use App\Middlewares\RoleAccess;
use App\Modules\Item\Model;
use App\Modules\List\Model as ListModel;
use App\Modules\Subscription\Controller as SubController;
use App\Services\RealtimeService;
use App\Services\NotificationWS;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Utils\Validator;
use App\Services\ImageManager;


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
         RoleAccess::adminOrOwner(ListModel::getOwnerList($_POST['list_id']));

        $validated = Validator::validate($_POST, [
            'user_id'    => 'required|integer',
            'list_id'    => 'required|integer',
            'name'       => 'required|string|max:255|min:3',
            'price'      => 'required|numeric|min:0',
            'description'=> 'required|string|min:5',
            'place'      => 'required|string|max:50',
            'place_link' => 'nullable|url'
        ]);

        try {

            $imageName = ImageManager::upload($_FILES['image'] ?? null, 'item');
            if (!$imageName) {
                $imageName = ImageManager::getImageForCategory($validated['name']);
            }
            $validated['img_name'] = $imageName;

            Model::create($validated);

            http_response_code(201);
            echo json_encode([
                'status' => 'success',
                'message' => 'Item creado exitosamente',
                'errors' => (object)[]
            ]);

        } catch (\Throwable $th) {
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => "Error interno en el servidor",
                "errors" => ["server" => [$th->getMessage()]]
            ]);
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

    public function giftItem($id) 
    {   
        error_log(print_r($_POST, true));
        try {
            //RoleAccess::admin();
           
            //mensaje
            $mensaje = $_POST['gift_message'] ?? 'You have received a gifted item!';
            $nombre  = $_POST['giver_name'] ?? 'Anonymous';
            $telefono = $_POST['giver_phone'] ?? 'Unknown';

            $Item = Model::findOrFail($id);
            $Item->update([
                'status' => 2 , 
                'message' => $mensaje, 
                'user_id' => $_REQUEST['auth']['user'] ?? null, // Si no viene el user_id, lo dejamos como null
                'giver_name' => $nombre,
                'giver_phone' => $telefono
            ]);

            $Item->load('list');

            //error_log("/lists/".$Item->list_id."?highlight=".$Item->id);
            try {
                SubController::sendPush(
                    $Item->list->user_id,
                    $_POST['giver_name'] ? '🎁 ¡Regalo de ' . $_POST['giver_name'] : '🎁 ¡Nuevo regalo de tu lista!',
                    "Te han regalado: " . $Item->name,
                    "/lists/".$Item->list_id."?highlight=".$Item->id
                );
            } catch (\Exception $pushError) {
                // Si falla el push, NO matamos el proceso. 
                // Solo lo anotamos en el log para debuggear.
                error_log("⚠️ Falló el envío Push pero el ítem se guardó: " . $pushError->getMessage());
            }   
            
        try{
            //RealtimeService::PublishPusher($Item);
           NotificationWS::enviarWhatsApp($Item);
        } catch (\Exception $wsError) {

            // Si falla el WS, NO matamos el proceso.
            // Solo lo anotamos en el log para debuggear.
            error_log("⚠️ Falló el envío WS pero el ítem se guardó: " . $wsError->getMessage());
        }
            
            header("HTTP/1.0 200 OK");
            echo json_encode(['status' => 'success', 'message' => 'Item gifted successfully']);
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
