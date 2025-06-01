<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class RegistroController extends Controller
{
    // Método para registrar un nuevo usuario
    public function registrar(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'telefono' => 'nullable|string|max:15', // Cambiar a 'nullable' para permitir vacío
            'direccion' => 'nullable|string|max:255', // Cambiar a 'nullable' para permitir vacío
            'plan_id'=> 'nullable|int',
        ]);
        

        // Si la validación falla, retornamos un error con los detalles
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Crear el nuevo usuario
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'telefono'=> $request->telefono,
            'direccion' => $request->direccion, 
            'plan_id' => $request->plan_id,
        ]);

        // Retornar una respuesta exitosa con el usuario creado
        return response()->json(['message' => 'Usuario registrado exitosamente', 'user' => $user], 201);
    }
}

