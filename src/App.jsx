import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Inicio from './pages/home/Inicio';
import Productos from './pages/Productos';
import PanelAdmin from './pages/admin/Inicio';
import Usuarios from './pages/admin/Usuarios';
import ProductosAdmin from './pages/admin/Productos';
import Categorias from './pages/Categorias';
import Ofertas from './pages/Ofertas';
import ProductoDetalle from './pages/ProductoDetalle';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Pedidos from './pages/vendedor/Pedidos';
import Carrito from './pages/Carrito';
import Checkout from './pages/Checkout';
import ResultadoCompra from './pages/ResultadoCompra';
import { obtenerCarrito } from './data/mockData';

export function RutasApp({ usuarioActual, iniciarSesion, carrito, setCarrito }) {
  const tipoUsuario = String(usuarioActual?.tipo || '').trim().toLowerCase();
  const esPersonal = ['admin', 'vendedor'].includes(tipoUsuario);
  const destinoPersonal = tipoUsuario === 'admin' ? '/admin' : '/pedidos';

  const protegerRuta = (roles, pagina) => {
    if (!usuarioActual) return <Navigate to="/login" replace />;

    const tipo = String(usuarioActual.tipo || '').trim().toLowerCase();
    return roles.includes(tipo) ? pagina : <Navigate to="/" replace />;
  };
  const protegerTienda = (pagina) => esPersonal
    ? <Navigate to={destinoPersonal} replace />
    : pagina;

  return (
    <Routes>
      <Route path="/" element={<Inicio modoInterno={esPersonal} />} />
      <Route path="/productos" element={protegerTienda(<Productos setCarrito={setCarrito} />)} />
      <Route path="/productos/:codigo" element={protegerTienda(<ProductoDetalle />)} />
      <Route path="/categorias" element={protegerTienda(<Categorias />)} />
      <Route path="/ofertas" element={protegerTienda(<Ofertas />)} />
      <Route path="/login" element={<Login usuarioActual={usuarioActual} setUsuarioActual={iniciarSesion} />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/pedidos" element={protegerRuta(['vendedor'], <Pedidos />)} />
      <Route path="/carrito" element={protegerTienda(<Carrito carrito={carrito} setCarrito={setCarrito} />)} />
      <Route path="/checkout" element={protegerTienda(<Checkout carrito={carrito} setCarrito={setCarrito} usuarioActual={usuarioActual} />)} />
      <Route path="/resultado-pago/:estado" element={protegerTienda(<ResultadoCompra />)} />
      <Route path="/admin" element={protegerRuta(['admin'], <PanelAdmin />)} />
      <Route path="/admin/usuarios" element={protegerRuta(['admin'], <Usuarios />)} />
      <Route path="/admin/productos" element={protegerRuta(['admin'], <ProductosAdmin />)} />
    </Routes>
  );
}

export default function App() {
  const [usuarioActual, setUsuarioActual] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('usuarioActual')) || null;
    } catch {
      return null;
    }
  });
  const [carrito, setCarrito] = useState(() => obtenerCarrito());

  const cerrarSesion = () => {
    setUsuarioActual(null);
    localStorage.removeItem('usuarioActual');
  };

  const iniciarSesion = (usuario) => {
    setUsuarioActual(usuario);
    localStorage.setItem('usuarioActual', JSON.stringify(usuario));
  };

  const cantidadTotalCarrito = carrito.reduce((total, item) => total + (item.cantidad || 1), 0);

  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <Navbar
          usuarioActual={usuarioActual}
          cerrarSesion={cerrarSesion}
          cantidadCarrito={cantidadTotalCarrito}
        />
        <main className="flex-grow-1">
          <RutasApp
            usuarioActual={usuarioActual}
            iniciarSesion={iniciarSesion}
            carrito={carrito}
            setCarrito={setCarrito}
          />
        </main>
          <Footer usuarioActual={usuarioActual} />
      </div>
    </BrowserRouter>
  );
}
