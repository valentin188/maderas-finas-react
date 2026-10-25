// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer({ usuarioActual }) {
  const tipoUsuario = String(usuarioActual?.tipo || '').trim().toLowerCase();
  const esPersonal = ['admin', 'vendedor'].includes(tipoUsuario);

  return (
    <footer className="site-footer text-center py-4 mt-auto">
      <div className="container">
        <p className="mb-3">&copy; 2026 Maderas Finas</p>
        {!esPersonal && (
          <nav className="footer-links" aria-label="Navegación del pie de página">
            <Link to="/">Inicio</Link>
            <Link to="/#nosotros">Nosotros</Link>
            <Link to="/productos">Productos</Link>
            <Link to="/#blog">Blog</Link>
            <Link to="/#contacto">Contacto</Link>
          </nav>
        )}
      </div>
    </footer>
  );
}
