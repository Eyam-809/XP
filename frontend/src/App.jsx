import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from './components/Login/login'
import Registro from './components/Registros/registros'
import Dashboard from './components/Layout/dashboard'
import ProtectorRuta from './components/Login/protectorRuta';
import ProductosFormulario from './components/Productos/productos';
import ProductosLista from './components/Productos/productosLista';
import DetalleProducto from './components/Layout/DetallesCompra/detalleproducto';
import Datospago from './components/Datos_pago/datos_pago';
import DetalleCompra from './components/DetalleCompra/detallecompra';
import Publicaciones from './components/Perfil/publicaciones';
import User_alta from './components/Usuarios/usurios';
import Peril_user from './components/Perfil/perfil';
import Carrito from './components/CarritoCompras/carrito';




function App() {


  return (
    <>
     <Router>
      <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path='/registros' element={<Registro />}/>
      <Route path='/datos_pago' element={<Datospago />}/>
      <Route path='/detallecompra' element={<DetalleCompra />}/>
      <Route path='/carrito' element={<Carrito />}/>
      
      <Route path="/login" element={<Login />} />
        <Route element={<ProtectorRuta/>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/productos" element={<ProductosFormulario />} />
        <Route path="/usuarios" element={<User_alta />} />
        <Route path='/publicaciones' element={<Publicaciones />}/>
        <Route path='/perfil' element={<Peril_user />}/>
        <Route path="/" element={<Dashboard />} />
        <Route path="/detalleproducto/:id" element={<DetalleProducto />} />
        <Route path="/detallecompra/:id" element={<DetalleCompra />} />
        </Route>
      </Routes>
    </Router>
     {/* <div>
        <ProductosFormulario onProductAdded={() => setUpdate(!update)} />
        <ProductosLista key={update} />
    </div>*/}
    {/*<User_alta/>*/}
    </>
  )
}

export default App
