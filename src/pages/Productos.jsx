// src/pages/Productos.jsx
import React, { useState, useEffect } from 'react';
import { obtenerProductos, guardarCarrito, obtenerCarrito } from '../data/mockData';

export default function Productos({ setCarrito }) {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    setProductos(obtenerProductos());
  }, []);

  const agregarAlCarrito = (producto) => {
    const carritoActual = obtenerCarrito();
    const existe = carritoActual.find((item) => item.codigo === producto.codigo);

    let nuevoCarrito;
    if (existe) {
      nuevoCarrito = carritoActual.map((item) =>
        item.codigo === producto.codigo
          ? { ...item, cantidad: (item.cantidad || 1) + 1 }
          : item
      );
    } else {
      nuevoCarrito = [...carritoActual, { ...producto, cantidad: 1 }];
    }

    guardarCarrito(nuevoCarrito);
    if (setCarrito) setCarrito(nuevoCarrito);
    alert(`"${producto.nombre}" se agregó al carrito.`);
  };

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container my-4">
      <h2 className="mb-4 fw-bold">Catálogo de Productos</h2>

      {/* Buscador de productos */}
      <div className="mb-4 col-md-6">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre o categoría..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      
      {/* Cuadrícula de Productos */}
      <div className="row">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((prod) => (
            <div key={prod.codigo} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold">{prod.nombre}</h5>
                  <p className="card-text text-muted mb-1">Categoría: {prod.categoria}</p>
                  <p className="card-text text-muted mb-2">Material: {prod.material}</p>
                  <p className="fw-bold fs-4 text-primary mb-2">${prod.precio.toLocaleString('cl-CL')}</p>
                  <span className={`badge mb-3 align-self-start ${prod.stock <= prod.stockCritico ? 'badge-critico' : 'badge-normal'}`}>
                    Stock: {prod.stock} {prod.stock <= prod.stockCritico && '(Stock Crítico)'}
                  </span>
                  <button
                    className="btn btn-success mt-auto fw-bold"
                    onClick={() => agregarAlCarrito(prod)}
                  >🛒 Agregar al Carrito</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="alert alert-info">No se encontraron productos que coincidan con la búsqueda</p>
          </div>
        )}
      </div>

    </div>
  );
}