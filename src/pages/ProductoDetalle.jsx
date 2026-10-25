import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { obtenerProductoPorCodigo } from '../data/mockData';

export default function ProductoDetalle() {
  const { codigo } = useParams();
  const producto = obtenerProductoPorCodigo(codigo?.toUpperCase());

  if (!producto) {
    return (
      <section className="container py-5">
        <div className="alert alert-warning" role="status">
          No encontramos ese producto.
        </div>
        <Link to="/productos" className="btn btn-outline-madera">
          Volver al catálogo
        </Link>
      </section>
    );
  }

  return (
    <section className="container py-5">
      <Link to="/productos" className="btn btn-outline-madera mb-4">
        ← Volver al catálogo
      </Link>

      <article className="card product-detail-card shadow-sm">
        <div className="row g-0">
          <div className="col-12 col-lg-6">
            <img
              className="product-detail-image"
              src={`/img/productos/${producto.imagen}`}
              alt={producto.nombre}
            />
          </div>
          <div className="col-12 col-lg-6">
            <div className="card-body product-detail-body">
              <p className="product-category mb-2">{producto.categoria}</p>
              <h1 className="product-detail-title">{producto.nombre}</h1>
              <p className="text-muted">Código {producto.codigo}</p>

              <dl className="product-detail-facts">
                <div>
                  <dt>Material</dt>
                  <dd>{producto.material}</dd>
                </div>
                <div>
                  <dt>Tiempo de fabricación</dt>
                  <dd>{producto.tiempo} días</dd>
                </div>
                <div>
                  <dt>Disponibilidad</dt>
                  <dd>{producto.stock} unidades</dd>
                </div>
              </dl>

              <p className="product-detail-price fw-bold mb-0">
                ${producto.precio.toLocaleString('cl-CL')}
              </p>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
