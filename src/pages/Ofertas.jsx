import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerOfertas } from '../data/ofertas';

export default function Ofertas() {
  const [ofertas, setOfertas] = useState([]);

  useEffect(() => {
    setOfertas(obtenerOfertas());
  }, []);

  return (
    <div className="offers-page">
      <section className="offers-hero py-5">
        <div className="container">
          <p className="eyebrow mb-2">Oportunidades por tiempo limitado</p>
          <h1>Ofertas para tu hogar</h1>
          <p className="lead mb-0">
            Encuentra muebles seleccionados de Maderas Finas a un precio especial.
          </p>
        </div>
      </section>

      <section className="container py-5" aria-labelledby="offers-heading">
        <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
          <div>
            <p className="eyebrow mb-1">Selección especial</p>
            <h2 id="offers-heading" className="mb-0">Promociones disponibles</h2>
          </div>
          <Link to="/productos" className="btn btn-outline-madera">
            Ver catálogo completo
          </Link>
        </div>

        {ofertas.length > 0 ? (
          <div className="row g-4">
            {ofertas.map((producto) => (
              <div className="col-12 col-md-6 col-lg-4" key={producto.codigo}>
                <article className="card offer-card h-100 shadow-sm">
                  <div className="offer-image-wrap">
                    <img
                      className="card-img-top"
                      src={`/img/productos/${producto.imagen}`}
                      alt={producto.nombre}
                      loading="lazy"
                    />
                    <span className="offer-badge">-{producto.descuento}%</span>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <p className="product-category mb-1">
                      {producto.categoria} · {producto.material}
                    </p>
                    <h3 className="card-title">{producto.nombre}</h3>
                    <p className="mb-0">
                      <span className="visually-hidden">Precio anterior: </span>
                      <del className="text-muted">
                        ${producto.precioAnterior.toLocaleString('cl-CL')}
                      </del>
                    </p>
                    <p className="offer-price fw-bold fs-4 mb-3">
                      <span className="visually-hidden">Precio oferta: </span>
                      ${producto.precioOferta.toLocaleString('cl-CL')}
                    </p>
                    <Link to={`/productos/${producto.codigo}`} className="btn btn-madera mt-auto">
                      Ver detalle
                    </Link>
                  </div>
                </article>
              </div>
            ))}
          </div>
        ) : (
          <p className="alert alert-info mb-0">No hay ofertas disponibles en este momento.</p>
        )}
      </section>
    </div>
  );
}
