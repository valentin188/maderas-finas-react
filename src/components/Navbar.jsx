// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ usuarioActual, cerrarSesion, cantidadCarrito = 0 }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container-fluid px-3 px-md-5">
        <Link className="navbar-brand fw-bold" to="/">
          🌲 Maderas Finas
        </Link>
        
        <div className="collapse navbar-collapse show" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/productos">Productos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/categorias">Categorías</Link>
            </li>
            
            <li className="nav-item">
              <Link className="nav-link text-warning fw-bold" to="/admin">Administración</Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            {usuarioActual ? (
              <button className="btn btn-outline-light btn-sm" onClick={cerrarSesion}>
                Cerrar Sesión ({usuarioActual.nombre})
              </button>
            ) : (
              <>
                <Link className="btn btn-outline-light btn-sm" to="/login">Iniciar Sesión</Link>
                <Link className="btn btn-warning btn-sm" to="/registro">Registrarse</Link>
              </>
            )}

            <Link className="btn btn-success btn-sm ms-2" to="/carrito">
              🛒 Carrito <span className="badge bg-white text-dark ms-1">{cantidadCarrito}</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}