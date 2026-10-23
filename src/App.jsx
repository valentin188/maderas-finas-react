// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Importación de las páginas reales
import Home from './pages/Home';
import Productos from './pages/Productos';
import Admin from './pages/Admin';
import Categorias from './pages/Categorias';
import Login from './pages/Login';
import Registro from './pages/Registro';

import { obtenerCarrito } from './data/mockData';

// Vistas temporales restantes (se reemplazarán en los siguientes pasos)
const Carrito = () => <div className="container py-5"><h2>🛒 Carrito de Compras</h2></div>;

export default function App() {
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    setCarrito(obtenerCarrito());
  }, []);

  const cerrarSesion = () => {
    setUsuarioActual(null);
  };

  const cantidadTotalCarrito = carrito.reduce((acc, item) => acc + (item.cantidad || 1), 0);

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar 
          usuarioActual={usuarioActual} 
          cerrarSesion={cerrarSesion} 
          cantidadCarrito={cantidadTotalCarrito} 
        />
        
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Productos setCarrito={setCarrito} />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/login" element={<Login usuarioActual={usuarioActual} setUsuarioActual={setUsuarioActual} />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}