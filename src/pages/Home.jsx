// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { obtenerProductos } from '../data/mockData';

export default function Home() {
  const productosDestacados = obtenerProductos().slice(0, 3);

  return (
    <div className="container my-4">
      {/* Hero Banner */}
      <div className="hero-banner text-center mb-5">
        <h1 className="display-4 fw-bold">Maderas Finas</h1>
        <p className="lead">Artesanía, calidad y elegancia en cada uno de nuestros muebles.</p>
        <Link to="/productos" className="btn btn-warning btn-lg mt-3 fw-bold">
          Ver Catálogo Completo
        </Link>
      </div>

      {/* Sección Productos Destacados */}
      <h3 className="mb-4 text-center fw-bold">Productos Destacados</h3>
      <div className="row">
        {productosDestacados.map((prod) => (
          <div key={prod.codigo} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold">{prod.nombre}</h5>
                <p className="card-text text-muted small">{prod.categoria} — {prod.material}</p>
                <p className="fw-bold fs-5 text-success mb-3">${prod.precio.toLocaleString('cl-CL')}</p>
                <Link to="/productos" className="btn btn-outline-dark btn-sm mt-auto">
                  Ver detalle
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}