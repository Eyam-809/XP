<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UsuariosController extends Controller
{
    // Obtener todos los usuarios
    public function index()
    {
        return response()->json(User::all());
    }

    // Obtener información del usuario autenticado
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    // Crear un nuevo usuario
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $usuario = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Encriptar contraseña
        ]);

        return response()->json($usuario, 201);
    }

   

    public function update(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'telefono' => 'nullable|string',
            'direccion' => 'nullable|string',
        ]);
    
        $usuario = auth()->user(); // Obtiene al usuario autenticado
    
        $usuario->name = $request->name;
        $usuario->email = $request->email;
        $usuario->telefono = $request->telefono;  // Actualiza el teléfono
        $usuario->direccion = $request->direccion;  // Actualiza la dirección
        $usuario->save();
    
        return response()->json(['message' => 'Usuario actualizado']);
    }
    
    


    // Eliminar usuario
    public function destroy($id)
    {
        $usuario = User::findOrFail($id);
        $usuario->delete();

        return response()->json(['message' => 'Usuario eliminado']);
    }
}
