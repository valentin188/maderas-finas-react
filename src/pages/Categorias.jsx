import React, { useEffect, useState } from 'react';
import { obtenerProductos } from '../data/mockData';

export default function Categorias() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    setProductos(obtenerProductos());
  }, []);

  const categorias = [...new Set(productos.map(prod => prod.categoria))];

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">🏷️ Categorías</h2>

      {categorias.map(categoria => (
        <section key={categoria} className="mb-5">
          <h3 className="border-bottom pb-2 mb-3">{categoria}</h3>

          <div className="row g-3">
            {productos
              .filter(prod => prod.categoria === categoria)
              .map(prod => (
                <div key={prod.codigo} className="col-12 col-md-6 col-lg-4">
                  <article className="card h-100 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title fw-bold">{prod.nombre}</h5>
                      <p className="card-text mb-1">Material: {prod.material}</p>
                      <p className="card-text mb-1">Tiempo de fabricación: {prod.tiempo} días</p>
                      <p className="fw-bold text-primary mb-0">${prod.precio.toLocaleString('cl-CL')}</p>
                    </div>
                  </article>
                </div>
              ))}
          </div>
        </section>
      ))}

      {productos.length === 0 && (
        <p className="alert alert-info">No hay productos registrados.</p>
      )}
    </div>
  );
}
