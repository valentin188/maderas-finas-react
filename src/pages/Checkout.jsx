
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  guardarCarrito,
  obtenerProductos
} from '../data/mockData';

const datosIniciales = {
  nombre: '',
  correo: '',
  telefono: '',
  direccion: ''
};

const formatoPrecio = (valor) =>
  '$' + Number(valor).toLocaleString('es-CL');

// Correos de ejemplo no permitidos
const correosEjemplo = new Set([
  'nombre.apellido@gmail.com',
  'ejemplo@gmail.com',
  'usuario@gmail.com',
  'tu@correo.cl',
  'test@test.com',
  'prueba@prueba.com'
]);

// Validar todos los campos del pedido
function validarDatos(datos) {
  const errores = {};

  const nombre = datos.nombre.trim();
  const correo = datos.correo.trim().toLowerCase();
  const telefono = datos.telefono.replace(/\D/g, '');
  const direccion = datos.direccion.trim();

  // Nombre completo
  if (!nombre) {
    errores.nombre = 'El nombre completo es obligatorio.';
  } else if (
    nombre.length < 3 ||
    nombre.split(/\s+/).length < 2
  ) {
    errores.nombre = 'Ingresa tu nombre y apellido.';
  }

  // Correo electrónico
  const formatoCorreo =
    /^[a-z0-9_%+-]+(?:\.[a-z0-9_%+-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i;

  if (!correo) {
    errores.correo = 'El correo electrónico es obligatorio.';
  } else if (
    correo.length > 254 ||
    !formatoCorreo.test(correo)
  ) {
    errores.correo = 'Ingresa un correo electrónico con formato válido.';
  } else if (correosEjemplo.has(correo)) {
    errores.correo = 'No utilices un correo de ejemplo.';
  }

  // Teléfono celular chileno
  if (!telefono) {
    errores.telefono = 'El teléfono es obligatorio.';
  } else if (
    !/^(?:56)?9\d{8}$/.test(telefono)
  ) {
    errores.telefono =
      'Ingresa un celular chileno válido, por ejemplo +56912345678.';
  }

  // Dirección
  if (!direccion) {
    errores.direccion = 'La dirección es obligatoria.';
  } else if (direccion.length < 5) {
    errores.direccion = 'Ingresa una dirección más completa.';
  }

  return errores;
}

export default function Checkout({ carrito, setCarrito }) {
  const [datos, setDatos] = useState({ ...datosIniciales });
  const [tocados, setTocados] = useState({});
  const [intentado, setIntentado] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');
  const [pedido, setPedido] = useState(null);

  const errores = validarDatos(datos);

  const total = carrito.reduce(
    (suma, p) =>
      suma + Number(p.precio) * Number(p.cantidad),
    0
  );

  // Mostrar errores después de salir del campo o intentar confirmar el pedido //
  const esInvalido = (campo) =>
    Boolean(errores[campo]) &&
    (Boolean(tocados[campo]) || intentado);

  const marcarTocado = (campo) => {
    setTocados((anterior) => ({
      ...anterior,
      [campo]: true
    }));
  };

  // Actualizar campos
  const actualizarCampo = (e) => {
    const { name, value } = e.target;

    setDatos((anterior) => ({
      ...anterior,
      [name]: value
    }));

    setErrorGeneral('');
  };

  // Confirmar el pedido
  const confirmar = (e) => {
    e.preventDefault();

    setIntentado(true);
    setErrorGeneral('');

    const erroresActuales = validarDatos(datos);

    // Bloquear si algún campo es inválido
    if (Object.keys(erroresActuales).length > 0) {
      setErrorGeneral(
        'Debes completar y corregir todos los campos obligatorios.'
      );
      return;
    }

    const catalogo = obtenerProductos();

    // Verificar cantidades y stock
    const carritoValido =
      carrito.length > 0 &&
      carrito.every((item) => {
        const productoActual = catalogo.find(
          (p) => p.codigo === item.codigo
        );

        return (
          productoActual &&
          Number.isInteger(item.cantidad) &&
          item.cantidad >= 1 &&
          item.cantidad <= productoActual.stock
        );
      });

    if (!carritoValido) {
      setErrorGeneral(
        'Hay un problema con el stock. Revisa tu carrito.'
      );
      return;
    }

    // Construir pedido con los precios actuales
    const productosPedido = carrito.map((item) => {
      const actual = catalogo.find(
        (p) => p.codigo === item.codigo
      );

      return {
        codigo: actual.codigo,
        nombre: actual.nombre,
        cantidad: item.cantidad,
        precio: actual.precio
      };
    });

    const nuevoPedido = {
      numero: 'MF-' + Date.now(),
      fecha: new Date().toISOString(),
      productos: productosPedido,
      total: productosPedido.reduce(
        (suma, p) => suma + p.precio * p.cantidad,
        0
      )
    };

    try {
      const guardados = JSON.parse(
        localStorage.getItem('pedidos_demo') || '[]'
      );

      const anteriores = Array.isArray(guardados)
        ? guardados
        : [];

      // Guardar pedido de demostración sin persistir datos personales
      localStorage.setItem(
        'pedidos_demo',
        JSON.stringify([...anteriores, nuevoPedido])
      );

      guardarCarrito([]);
      setCarrito([]);

      setPedido({
        ...nuevoPedido,
        nombreCliente: datos.nombre.trim()
      });

    } catch {
      setErrorGeneral(
        'No se pudo registrar el pedido de demostración.'
      );
    }
  };

  // Confirmación exitosa
  if (pedido) {
    return (
      <main className="container py-5">
        <div
          className="carrito-resumen p-5 text-center mx-auto"
          style={{ maxWidth: 680 }}
        >
          <h2 className="fw-bold">
            ¡Pedido registrado correctamente!
          </h2>

          <p className="mt-3">
            Gracias, {pedido.nombreCliente}.
          </p>

          <p>
            Número de pedido:
            <strong> {pedido.numero}</strong>
          </p>

          <h3 className="precio-carrito">
            {formatoPrecio(pedido.total)}
          </h3>

          <p className="text-muted mt-3">
            Este pedido es una demostración.
            No se realizó ningún cobro ni envío.
          </p>
          
          <Link
            to="/productos"
            className="btn btn-volver-catalogo mt-4"
          >
            <span aria-hidden="true">←</span>
            <span>Volver al catálogo</span>
          </Link>

        </div>
      </main>
    );
  }

  // Carrito vacío
  if (carrito.length === 0) {
    return (
      <main className="container py-5 text-center">
        <h2>No tienes productos para confirmar</h2>

        <Link to="/productos" className="btn btn-madera mt-3">
          Ver productos
        </Link>
      </main>
    );
  }

  return (
    <main className="container-fluid pagina-carrito px-3 px-md-5 py-5">

      <h1 className="fw-bold mb-2">
        Confirmar pedido
      </h1>

      <p className="text-muted mb-4">
        Formulario de prueba. Utiliza datos ficticios.
      </p>

      <div className="row g-4">

        {/* FORMULARIO DEL CLIENTE */}
        <div className="col-lg-8">

          <form
            className="carrito-producto p-4"
            onSubmit={confirmar}
            noValidate
          >

            <h3 className="fs-4 mb-2">
              Datos del cliente
            </h3>

            <p className="text-muted small mb-4">
              Todos los campos marcados con * son obligatorios.
            </p>

            {errorGeneral && (
              <div className="alert alert-danger" role="alert">
                {errorGeneral}
              </div>
            )}

            {/* NOMBRE COMPLETO */}
            <div className="mb-3">
              <label
                htmlFor="pedido-nombre"
                className="form-label fw-semibold"
              >
                Nombre completo
                <span className="text-danger"> *</span>
              </label>

              <input
                id="pedido-nombre"
                type="text"
                name="nombre"
                className={`form-control ${
                  esInvalido('nombre') ? 'is-invalid' : ''
                }`}
                placeholder="Nombre y apellido"
                value={datos.nombre}
                onChange={actualizarCampo}
                onBlur={() => marcarTocado('nombre')}
                autoComplete="name"
                maxLength={100}
                required
                aria-invalid={esInvalido('nombre')}
              />

              {esInvalido('nombre') && (
                <div className="invalid-feedback">
                  {errores.nombre}
                </div>
              )}
            </div>

            {/* CORREO ELECTRÓNICO */}
            <div className="mb-3">
              <label
                htmlFor="pedido-correo"
                className="form-label fw-semibold"
              >
                Correo electrónico
                <span className="text-danger"> *</span>
              </label>

              <input
                id="pedido-correo"
                type="email"
                name="correo"
                className={`form-control ${
                  esInvalido('correo') ? 'is-invalid' : ''
                }`}
                placeholder="Ingresa tu correo electrónico"
                value={datos.correo}
                onChange={actualizarCampo}
                onBlur={() => marcarTocado('correo')}
                autoComplete="email"
                maxLength={254}
                required
                aria-invalid={esInvalido('correo')}
              />

              {esInvalido('correo') && (
                <div className="invalid-feedback">
                  {errores.correo}
                </div>
              )}
            </div>

            {/* TELÉFONO */}
            <div className="mb-3">
              <label
                htmlFor="pedido-telefono"
                className="form-label fw-semibold"
              >
                Teléfono
                <span className="text-danger"> *</span>
              </label>

              <input
                id="pedido-telefono"
                type="tel"
                name="telefono"
                className={`form-control ${
                  esInvalido('telefono') ? 'is-invalid' : ''
                }`}
                placeholder="+56912345678"
                value={datos.telefono}
                onChange={actualizarCampo}
                onBlur={() => marcarTocado('telefono')}
                autoComplete="tel"
                maxLength={20}
                required
                aria-invalid={esInvalido('telefono')}
              />

              {esInvalido('telefono') && (
                <div className="invalid-feedback">
                  {errores.telefono}
                </div>
              )}
            </div>

            {/* DIRECCIÓN */}
            <div className="mb-4">
              <label
                htmlFor="pedido-direccion"
                className="form-label fw-semibold"
              >
                Dirección
                <span className="text-danger"> *</span>
              </label>

              <input
                id="pedido-direccion"
                type="text"
                name="direccion"
                className={`form-control ${
                  esInvalido('direccion') ? 'is-invalid' : ''
                }`}
                placeholder="Calle, número, comuna, región"
                value={datos.direccion}
                onChange={actualizarCampo}
                onBlur={() => marcarTocado('direccion')}
                autoComplete="street-address"
                maxLength={150}
                required
                aria-invalid={esInvalido('direccion')}
              />

              {esInvalido('direccion') && (
                <div className="invalid-feedback">
                  {errores.direccion}
                </div>
              )}
            </div>

            {/* BOTÓN CONFIRMAR PEDIDO */}
            <button
              type="submit"
              className="btn btn-confirmar-pedido w-100 mt-3"
            >
              <span className="d-flex align-items-center gap-2">
                <span aria-hidden="true"></span>
                Confirmar pedido
              </span>

              <span
                className="flecha-confirmar"
                aria-hidden="true"
              >
                →
              </span>
            </button>

          </form>
        </div>

        {/* RESUMEN DEL PEDIDO */}
        <div className="col-lg-4">

          <div className="carrito-resumen p-4">

            <h3 className="fs-4 fw-bold">
              Resumen del pedido
            </h3>

            <hr />

            {carrito.map((producto) => (
              <div
                key={producto.codigo}
                className="d-flex justify-content-between gap-3 mb-3"
              >
                <span>
                  {producto.nombre} × {producto.cantidad}
                </span>

                <strong>
                  {formatoPrecio(
                    producto.precio * producto.cantidad
                  )}
                </strong>
              </div>
            ))}

            <hr />

            <div className="d-flex justify-content-between">
              <strong>Total estimado</strong>

              <strong className="precio-carrito">
                {formatoPrecio(total)}
              </strong>
            </div>

            <p className="text-muted small mt-3">
              El despacho se coordina por separado.
            </p>

          </div>
        </div>

      </div>
    </main>
  );
}