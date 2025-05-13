import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./datos_pago.css";
import { BsPerson } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const Datospago = () => {
  const location = useLocation();
  const { producto, cantidad } = location.state || {}; // Accede a la información pasada desde DetalleCompra
  const navigate = useNavigate(); // Hook para volver a la pantalla anterior
  const [paymentMethod, setPaymentMethod] = useState(0); // 0 = No seleccionado, 2 = Crédito, 3 = Débito
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const Ir_Dash = () => {
    navigate("/dashboard");
  };

  const Ir_carrito = () => {
    navigate("/carrito");
  };

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
  };

  const handlePayment = () => {
    Swal.fire({
      title: "Pago exitoso",
      text: "Tu compra ha sido procesada correctamente.",
      icon: "success",
      confirmButtonText: "Aceptar",
    }).then(() => {
      navigate("/dashboard"); // Redirige al dashboard después de cerrar la alerta
    });
  };

  // Calcular subtotal, IVA y total
  const subtotal = producto ? producto.price * cantidad : 0;
  const iva = subtotal * 0.5;  // 16% de IVA
  const total = subtotal + iva;

  return (
    <div className="payment-container">
      {/* Barra de navegación */}
      <nav className="nav_DeCom">
        <div className="max-w-12xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold" onClick={Ir_Dash}>XPMartek</h1>

          {/* Menú de navegación */}
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="p-2 rounded text-black"
            />
            <i onClick={Ir_carrito} className="bi bi-cart4 text-2xl cursor-pointer"></i>
          </div>

          {/* Menú desplegable Mi cuenta */}
          <div className="relative">
            <button onClick={toggleMenu} className="boton-mi-cuenta flex items-center">
              <BsPerson size={24} />
              <span className="ml-2 hidden md:inline">Mi cuenta</span>
            </button>
            {menuAbierto && (
              <ul className="menu-desplegable">
                <li><a href="/perfil">Perfil</a></li>
                <li><a className="Txt_nav" onClick={handleLogout}>Cerrar sesión</a></li>
              </ul>
            )}
          </div>
        </div>
      </nav>

      {/* Sección de pago */}
      <div className="payment-section">
        <div className="payment-options">
          <h2>Finalizar compra</h2>
          <label>
            <input
              className="input_pago"
              type="radio"
              name="payment"
              value="credit"
              checked={paymentMethod === 2}
              onChange={() => handlePaymentMethodChange(2)} // Valor 2 para crédito
            />
            Tarjeta de crédito
          </label>
          <label>
            <input
              className="input_pago"
              type="radio"
              name="payment"
              value="debit"
              checked={paymentMethod === 3}
              onChange={() => handlePaymentMethodChange(3)} // Valor 3 para débito
            />
            Tarjeta de débito
          </label>

          {/* Mostrar los campos de la tarjeta solo si se selecciona tarjeta de crédito o débito */}
          {paymentMethod === 2 || paymentMethod === 3 ? (
            <div className="card-details">
              <label>Número de tarjeta:</label>
              <input
                type="text"
                maxLength="16"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
              />

              <label>Nombre del titular:</label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Nombre en la tarjeta"
              />

              <label>Fecha de vencimiento:</label>
              <input
                type="text"
                maxLength="5"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/AA"
              />

              <label>CVV:</label>
              <input
                type="text"
                maxLength="3"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
              />
            </div>
          ) : null}
        </div>

        {/* Resumen de compra */}
        <div className="order-summary">
          <h2>Resumen de compra</h2>
          <p><strong>Producto:</strong> {producto?.name}</p>
          <p><strong>Envío:</strong> <span className="free-shipping">Gratis</span></p>
          <p><strong>Cantidad:</strong> {cantidad}</p>
          <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)} MXN</p>
          <p><strong>Costos adicionales:</strong> ${iva.toFixed(2)} MXN</p>
          <p><strong>Total:</strong> ${total.toFixed(2)} MXN</p>
          <button onClick={handlePayment} className="pay-button">Pagar</button>
          <button className="cancel-button" onClick={() => navigate(-1)}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default Datospago;
