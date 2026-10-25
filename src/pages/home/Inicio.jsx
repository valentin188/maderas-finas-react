import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerProductos } from '../../data/mockData';
import { correoValido } from '../../data/validaciones';

const datosContactoIniciales = { nombre: '', email: '', mensaje: '' };

const validarContacto = (datos) => {
  const errores = {};

  if (!datos.nombre.trim()) {
    errores.nombre = 'El nombre es obligatorio.';
  } else if (datos.nombre.length > 100) {
    errores.nombre = 'El nombre no puede superar los 100 caracteres.';
  }

  if (!datos.email.trim()) {
    errores.email = 'El correo es obligatorio.';
  } else if (datos.email.length > 100) {
    errores.email = 'El correo no puede superar los 100 caracteres.';
  } else if (!correoValido(datos.email)) {
    errores.email = 'El correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com.';
  }

  if (!datos.mensaje.trim()) {
    errores.mensaje = 'El mensaje es obligatorio.';
  } else if (datos.mensaje.length > 500) {
    errores.mensaje = 'El mensaje no puede superar los 500 caracteres.';
  }

  return errores;
};

const validarCampoContacto = (campo, valor) => {
  if (campo === 'nombre') {
    if (!valor.trim()) return 'El nombre es obligatorio.';
    if (valor.length > 100) return 'El nombre no puede superar los 100 caracteres.';
  }

  if (campo === 'email') {
    if (!valor.trim()) return 'El correo es obligatorio.';
    if (valor.length > 100) return 'El correo no puede superar los 100 caracteres.';
    if (!correoValido(valor)) return 'El correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com.';
  }

  if (campo === 'mensaje') {
    if (!valor.trim()) return 'El mensaje es obligatorio.';
    if (valor.length > 500) return 'El mensaje no puede superar los 500 caracteres.';
  }

  return '';
};

export default function Inicio({ modoInterno = false }) {
  const productosDestacados = obtenerProductos().slice(0, 3);
  const [mensajeEnviado, setMensajeEnviado] = useState(false);
  const [contacto, setContacto] = useState(datosContactoIniciales);
  const [erroresContacto, setErroresContacto] = useState({});

  const enviarMensaje = (evento) => {
    evento.preventDefault();
    const errores = validarContacto(contacto);
    setErroresContacto(errores);
    if (Object.keys(errores).length > 0) {
      setMensajeEnviado(false);
      return;
    }

    setMensajeEnviado(true);
    setContacto(datosContactoIniciales);
  };

  const actualizarContacto = (evento) => {
    const { name, value } = evento.target;
    const datosActualizados = { ...contacto, [name]: value };
    setContacto(datosActualizados);
    setMensajeEnviado(false);
    setErroresContacto(errores => ({
      ...errores,
      [name]: validarCampoContacto(name, value),
    }));
  };

  return (
    <div>
      <section id="presentacion" className="py-5">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-md-6">
              <p className="eyebrow mb-2">Muebles hechos para durar</p>
              <h1 className="fw-bold">Maderas Finas</h1>
              <p className="lead">
                Maderas Finas es una fábrica de muebles con más de 20 años de
                experiencia en el mercado nacional.
              </p>
              <p>
                Fue fundada en 2003 y se encuentra ubicada en la comuna de San
                Antonio, Región de Valparaíso.
              </p>
              {!modoInterno && (
                <Link to="/productos" className="btn btn-madera btn-lg mt-2">
                  Ver catálogo completo
                </Link>
              )}
            </div>
            <div className="col-md-6 text-center">
              <img
                className="company-image img-fluid"
                src="/img/logo/empresa.jpg"
                alt="Muebles fabricados por Maderas Finas"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="nosotros" className="py-5 bg-white">
        <div className="container">
          <h2 className="text-center mb-4">Nosotros</h2>
          <div className="row g-4">
            <div className="col-md-6">
              <article className="about-panel h-100">
                <h3>Sobre Maderas Finas</h3>
                <p>
                  Maderas Finas es una fábrica de muebles con más de 20 años de
                  experiencia en el mercado nacional.
                </p>
                <p>
                  La empresa fue fundada en 2003 y se encuentra ubicada en San
                  Antonio, Región de Valparaíso.
                </p>
                <p className="mb-0">
                  Cuenta con una planta de producción de 8.000 m² y actualmente
                  produce aproximadamente 15.000 unidades mensuales.
                </p>
              </article>
            </div>
            <div className="col-md-6">
              <article className="about-panel h-100">
                <h3>Producción</h3>
                <p>
                  La fábrica cuenta con distintas líneas de producción dedicadas
                  al corte y preparación de madera, ensamblaje, acabado y embalaje
                  de los productos. El proceso productivo se divide en cuatro
                  líneas principales.
                </p>
                <ul className="production-list mb-0">
                  <li>Línea de Corte: corte y preparación de la madera.</li>
                  <li>Línea de Ensamblaje: ensamblaje de las estructuras.</li>
                  <li>Línea de Acabado: lijado, barnizado y pulido.</li>
                  <li>Línea de Embalaje: empaque y preparación para despacho.</li>
                </ul>
              </article>
            </div>
          </div>
        </div>
      </section>

      {!modoInterno && <section id="productos" className="py-5 product-section">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
            <div>
              <p className="eyebrow mb-1">Selección de nuestro catálogo</p>
              <h2 className="mb-0">Productos destacados</h2>
            </div>
            <Link to="/productos" className="btn btn-outline-madera">
              Ver todos los productos
            </Link>
          </div>
          <div className="row g-4">
            {productosDestacados.map((prod) => (
              <div key={prod.codigo} className="col-md-4">
                <article className="card product-card h-100 shadow-sm">
                  <img
                    className="card-img-top"
                    src={`/img/productos/${prod.imagen}`}
                    alt={prod.nombre}
                    loading="lazy"
                  />
                  <div className="card-body d-flex flex-column">
                    <p className="product-category mb-1">{prod.categoria} · {prod.material}</p>
                    <h3 className="card-title fw-bold">{prod.nombre}</h3>
                    <p className="fw-bold fs-5 text-madera mb-3">
                      ${prod.precio.toLocaleString('cl-CL')}
                    </p>
                    <Link to={`/productos/${prod.codigo}`} className="btn btn-outline-madera btn-sm mt-auto">
                      Ver detalle
                    </Link>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>}

      <section id="blog" className="py-5 bg-white">
        <div className="container">
          <p className="eyebrow text-center mb-1">Nuestro trabajo</p>
          <h2 className="text-center mb-4">Blog</h2>
          <div className="row g-4">
            <div className="col-md-6">
              <article className="card blog-card h-100">
                <img className="card-img-top" src="/img/blog/blog_1.jpg" alt="Producción de muebles de Maderas Finas" loading="lazy" />
                <div className="card-body">
                  <h3 className="card-title">Producción de muebles en Maderas Finas</h3>
                  <p className="card-text">
                    Conoce cómo Maderas Finas organiza sus distintas líneas de
                    producción para fabricar sus muebles.
                  </p>
                </div>
              </article>
            </div>
            <div className="col-md-6">
              <article className="card blog-card h-100">
                <img className="card-img-top" src="/img/blog/blog_2.jpg" alt="Líneas de producción de Maderas Finas" loading="lazy" />
                <div className="card-body">
                  <h3 className="card-title">Las líneas de producción</h3>
                  <p className="card-text">
                    Conoce las etapas de corte, ensamblaje, acabado y embalaje
                    presentes en la fábrica.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="contacto" className="py-5 contact-section">
        <div className="container-fluid contact-container">
          <h2 className="text-center contact-title">Contacto</h2>
          <div className="contact-panel">
            <form onSubmit={enviarMensaje} noValidate>
              <div className="mb-3">
                <label htmlFor="contacto-nombre" className="form-label">Nombre</label>
                <input
                  id="contacto-nombre"
                  name="nombre"
                  type="text"
                  className="form-control"
                  value={contacto.nombre}
                  maxLength="100"
                  onChange={actualizarContacto}
                  aria-invalid={Boolean(erroresContacto.nombre)}
                  aria-describedby={erroresContacto.nombre ? 'contacto-error-nombre' : undefined}
                  required
                />
                {erroresContacto.nombre && <div id="contacto-error-nombre" className="invalid-feedback d-block">{erroresContacto.nombre}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="contacto-email" className="form-label">Correo electrónico</label>
                <input
                  id="contacto-email"
                  name="email"
                  type="email"
                  className="form-control"
                  value={contacto.email}
                  maxLength="100"
                  onChange={actualizarContacto}
                  aria-invalid={Boolean(erroresContacto.email)}
                  aria-describedby={erroresContacto.email ? 'contacto-error-email' : undefined}
                  required
                />
                {erroresContacto.email && <div id="contacto-error-email" className="invalid-feedback d-block">{erroresContacto.email}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="contacto-mensaje" className="form-label">Mensaje</label>
                <textarea
                  id="contacto-mensaje"
                  name="mensaje"
                  className="form-control"
                  rows="6"
                  maxLength="500"
                  value={contacto.mensaje}
                  onChange={actualizarContacto}
                  aria-invalid={Boolean(erroresContacto.mensaje)}
                  aria-describedby={erroresContacto.mensaje ? 'contacto-error-mensaje' : 'contacto-contador'}
                  required
                />
                <div id="contacto-contador" className="contact-counter" aria-live="polite">
                  {contacto.mensaje.length}/500
                </div>
                {erroresContacto.mensaje && <div id="contacto-error-mensaje" className="invalid-feedback d-block">{erroresContacto.mensaje}</div>}
              </div>
              <div className="text-center">
                <button type="submit" className="btn btn-madera btn-lg">Enviar mensaje</button>
              </div>
              {mensajeEnviado && (
                <p className="alert alert-success mt-3 mb-0" role="status">
                  Gracias por escribirnos. Recibimos tu mensaje.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
