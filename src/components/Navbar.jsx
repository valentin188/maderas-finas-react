// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

export default function Navbar({ usuarioActual, cerrarSesion, cantidadCarrito = 0 }) {
  const tipoUsuario = String(usuarioActual?.tipo || '').trim().toLowerCase();
  const esAdmin = tipoUsuario === 'admin';
  const esVendedor = tipoUsuario === 'vendedor';
  const esPersonal = esAdmin || esVendedor;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container-fluid px-3 px-md-5">
        <Link className="navbar-brand fw-bold" to="/">
          <img className="brand-logo" src="/img/logo/logo.jpg" alt="Marca Maderas Finas" />
          Maderas Finas
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
          aria-label="Mostrar u ocultar navegación">
        <span className="navbar-toggler-icon"></span>
        </button>

        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {esPersonal ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to={esAdmin ? '/admin' : '/pedidos'}>
                    {esAdmin ? 'Administración' : 'Pedidos'}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/">Volver a la tienda</Link>
                </li>
              </>
            ) : (
              <>
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
                  <Link className="nav-link" to="/ofertas">Ofertas</Link>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {usuarioActual ? (
              <button className="btn btn-outline-light btn-sm" onClick={cerrarSesion}>
                Cerrar sesión
              </button>
            ) : (
              <>
                <Link className="btn btn-outline-light btn-sm" to="/login">Iniciar Sesión</Link>
                <Link className="btn btn-warning btn-sm" to="/registro">Registrarse</Link>
              </>
            )}

            {!esPersonal && (
              <Link className="btn btn-success btn-sm ms-2" to="/carrito">
                🛒 Carrito <span className="badge bg-white text-dark ms-1">{cantidadCarrito}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
