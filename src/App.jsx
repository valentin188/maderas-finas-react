
import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import './App.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Productos from './pages/Productos';
import Categorias from './pages/Categorias';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Admin from './pages/Admin';
import Carrito from './pages/Carrito';
import Checkout from './pages/Checkout';

import { obtenerCarrito } from './data/mockData';

export default function App() {
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [carrito, setCarrito] = useState(obtenerCarrito);

  const cerrarSesion = () => {
    setUsuarioActual(null);
  };

  const cantidadCarrito = carrito.reduce(
    (total, producto) => total + (producto.cantidad || 1),
    0
  );

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar
          usuarioActual={usuarioActual}
          cerrarSesion={cerrarSesion}
          cantidadCarrito={cantidadCarrito}
        />

        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/productos"
              element={<Productos setCarrito={setCarrito} />}
            />

            <Route path="/categorias" element={<Categorias />} />

            <Route
              path="/login"
              element={
                <Login
                  usuarioActual={usuarioActual}
                  setUsuarioActual={setUsuarioActual}
                />
              }
            />

            <Route path="/registro" element={<Registro />} />

            <Route path="/admin" element={<Admin />} />

            <Route
              path="/carrito"
              element={
                <Carrito
                  carrito={carrito}
                  setCarrito={setCarrito}
                />
              }
            />

            <Route
              path="/checkout"
              element={
                <Checkout
                  carrito={carrito}
                  setCarrito={setCarrito}
                />
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}