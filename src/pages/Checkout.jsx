import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { obtenerProductos, guardarCarrito } from '../data/mockData';
import { guardarPedido } from '../data/pedidos';
import { regionesChile } from '../data/ubicaciones';

const RESULTADO_COMPRA_KEY = 'resultado_ultima_compra';
const CHECKOUT_DRAFT_KEY = 'checkout_pendiente';
const formatoPrecio = (valor) => `$${Number(valor).toLocaleString('es-CL')}`;

const firmaCarrito = (carrito) => JSON.stringify(
  carrito.map(({ codigo, cantidad }) => [codigo, Number(cantidad)]).sort(([a], [b]) => a.localeCompare(b)),
);

function leerCheckoutPendiente() {
  try {
    return JSON.parse(localStorage.getItem(CHECKOUT_DRAFT_KEY) || 'null');
  } catch {
    return null;
  }
}

function crearDatosIniciales(usuarioActual, carrito) {
  const pendiente = leerCheckoutPendiente();
  if (pendiente?.firmaCarrito === firmaCarrito(carrito) && pendiente.datos) {
    return {
      nombre: pendiente.datos.nombre || '',
      apellidos: pendiente.datos.apellidos || '',
      email: pendiente.datos.email || '',
      direccion: pendiente.datos.direccion || pendiente.datos.calle || '',
      piso: pendiente.datos.piso || pendiente.datos.departamento || '',
      region: pendiente.datos.region || regionesChile[0].region,
      comuna: pendiente.datos.comuna || regionesChile[0].comunas[0],
      indicaciones: pendiente.datos.indicaciones || '',
    };
  }

  const regionRegistrada = regionesChile.some(({ region }) => region === usuarioActual?.region)
    ? usuarioActual.region
    : regionesChile[0].region;
  const comunasRegion = regionesChile.find(({ region }) => region === regionRegistrada)?.comunas || [];

  return {
    nombre: usuarioActual?.nombre || '',
    apellidos: usuarioActual?.apellidos || '',
    email: usuarioActual?.email || '',
    direccion: usuarioActual?.direccion || '',
    piso: '',
    region: regionRegistrada,
    comuna: comunasRegion.includes(usuarioActual?.comuna) ? usuarioActual.comuna : comunasRegion[0],
    indicaciones: '',
  };
}

const correoTieneFormatoValido = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());

export default function Checkout({ carrito, setCarrito, usuarioActual }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const simularFallo = searchParams.get('pago') === 'fallido';
  const [datos, setDatos] = useState(() => crearDatosIniciales(usuarioActual, carrito));
  const [error, setError] = useState('');
  const catalogo = obtenerProductos();
  const productosPedido = carrito.map((item) => {
    const producto = catalogo.find(({ codigo }) => codigo === item.codigo);
    return producto ? { ...producto, cantidad: Number(item.cantidad) } : null;
  });
  const subtotal = productosPedido.reduce(
    (suma, producto) => suma + (producto ? Number(producto.precio) * producto.cantidad : 0), 0,
  );

  const cambiarDato = ({ target: { name, value } }) => {
    setDatos((actuales) => ({
      ...actuales,
      [name]: value,
      ...(name === 'region' ? { comuna: '' } : {}),
    }));
    setError('');
  };

  const confirmarCompra = (evento) => {
    evento.preventDefault();
    const datosPedido = {
      nombre: datos.nombre.trim(),
      apellidos: datos.apellidos.trim(),
      email: datos.email.trim().toLowerCase(),
      direccion: datos.direccion.trim(),
      piso: datos.piso.trim(),
      region: datos.region,
      comuna: datos.comuna,
      indicaciones: datos.indicaciones.trim(),
    };
    const comunasValidas = regionesChile.find(({ region }) => region === datosPedido.region)?.comunas || [];

    if (datosPedido.nombre.length < 2 || datosPedido.nombre.length > 50) {
      setError('Ingresa un nombre válido (máximo 50 caracteres).');
      return;
    }
    if (datosPedido.apellidos.length < 2 || datosPedido.apellidos.length > 100) {
      setError('Ingresa apellidos válidos (máximo 100 caracteres).');
      return;
    }
    if (!correoTieneFormatoValido(datosPedido.email) || datosPedido.email.length > 100) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }
    if (datosPedido.direccion.length < 5 || datosPedido.direccion.length > 150) {
      setError('Ingresa una dirección válida (máximo 150 caracteres).');
      return;
    }
    if (!comunasValidas.includes(datosPedido.comuna)) {
      setError('Selecciona una región y comuna válidas.');
      return;
    }
    if (!carrito.length || productosPedido.some((producto) => !producto)) {
      setError('No hay productos válidos para confirmar en el carrito.');
      return;
    }

    const catalogoActual = obtenerProductos();
    const stockDisponible = productosPedido.every((producto) => {
      const actual = catalogoActual.find(({ codigo }) => codigo === producto.codigo);
      return actual && Number.isInteger(producto.cantidad) && producto.cantidad > 0 && producto.cantidad <= Number(actual.stock);
    });
    const total = productosPedido.reduce((suma, producto) => suma + Number(producto.precio) * producto.cantidad, 0);
    const numero = `MF-${Date.now()}`;
    const compra = {
      numero,
      fecha: new Date().toISOString(),
      estado: stockDisponible && !simularFallo ? 'exitosa' : 'fallida',
      cliente: `${datosPedido.nombre} ${datosPedido.apellidos}`,
      nombre: datosPedido.nombre,
      apellidos: datosPedido.apellidos,
      email: datosPedido.email,
      direccion: datosPedido.direccion,
      piso: datosPedido.piso,
      region: datosPedido.region,
      comuna: datosPedido.comuna,
      indicaciones: datosPedido.indicaciones,
      direccionEntrega: [datosPedido.direccion, datosPedido.piso, datosPedido.comuna, datosPedido.region].filter(Boolean).join(', '),
      metodoEntrega: 'Despacho a domicilio',
      costoDespacho: 0,
      articulos: productosPedido.map(({ codigo, nombre, imagen, precio, cantidad }) => ({ codigo, nombre, imagen, precio: Number(precio), cantidad })),
      subtotal: total,
      total,
      motivoFallo: !stockDisponible
        ? 'No se pudo completar el pago porque ya no hay stock suficiente para todos los productos.'
        : simularFallo ? 'No se pudo completar el pago. Puedes volver a intentarlo.' : '',
    };

    try {
      localStorage.setItem(RESULTADO_COMPRA_KEY, JSON.stringify(compra));

      if (compra.estado === 'exitosa') {
        const productosActualizados = catalogoActual.map((producto) => {
          const comprado = compra.articulos.find(({ codigo }) => codigo === producto.codigo);
          return comprado ? { ...producto, stock: Number(producto.stock) - comprado.cantidad } : producto;
        });
        localStorage.setItem('productos', JSON.stringify(productosActualizados));
        guardarPedido({
          id: numero,
          cliente: compra.cliente,
          email: compra.email,
          articulos: compra.articulos,
          total,
          estado: 'Pendiente',
          creadoEn: compra.fecha,
          direccionEntrega: compra.direccionEntrega,
          metodoEntrega: compra.metodoEntrega,
          metodoPago: 'Pago confirmado',
        });
        localStorage.removeItem(CHECKOUT_DRAFT_KEY);
        guardarCarrito([]);
        setCarrito([]);
      } else {
        localStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify({ datos: datosPedido, firmaCarrito: firmaCarrito(carrito) }));
      }

      navigate(`/resultado-pago/${compra.estado}`);
    } catch {
      setError('No se pudo guardar el resultado de la compra. Inténtalo nuevamente.');
    }
  };

  if (!carrito.length) {
    return (
      <main className="container py-5 text-center">
        <h1 className="h2 fw-bold">No tienes productos para confirmar</h1>
        <Link to="/productos" className="btn btn-madera mt-3">Ver productos</Link>
      </main>
    );
  }

  const comunasDisponibles = regionesChile.find(({ region }) => region === datos.region)?.comunas || [];
  return (
    <main className="container py-5 checkout-page">
      <div className="checkout-card">
        <header className="checkout-heading">
          <p className="eyebrow mb-1">Compra</p>
          <h1 className="checkout-title">Checkout</h1>
          <p className="text-muted mb-0">Completa la información para finalizar tu compra.</p>
        </header>

        <form onSubmit={confirmarCompra} noValidate>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}

          <section className="checkout-section" aria-labelledby="checkout-cart-title">
            <h2 id="checkout-cart-title" className="h4 fw-bold">Carrito de compra</h2>
          <p className="text-muted small">Productos seleccionados para tu compra.</p>
            <div className="table-responsive checkout-table-wrap">
              <table className="table align-middle mb-0">
                <thead>
                  <tr><th scope="col">Imagen</th><th scope="col">Nombre</th><th scope="col">Precio</th><th scope="col">Cantidad</th><th scope="col">Subtotal</th></tr>
                </thead>
                <tbody>
                  {productosPedido.map((producto, index) => producto && (
                    <tr key={producto.codigo}>
                      <td><img className="checkout-product-image" src={`/img/productos/${producto.imagen}`} alt={producto.nombre} /></td>
                      <td>{producto.nombre}</td>
                      <td className="text-nowrap">{formatoPrecio(producto.precio)}</td>
                      <td>{producto.cantidad}</td>
                      <td className="text-nowrap">{formatoPrecio(producto.precio * producto.cantidad)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="checkout-section" aria-labelledby="checkout-customer-title">
            <h2 id="checkout-customer-title" className="h4 fw-bold">Información del cliente</h2>
            <p className="text-muted small">Completa la siguiente información.</p>
            <div className="row g-3">
              <div className="col-12 col-md-4">
                <label className="form-label" htmlFor="checkout-nombre">Nombre <span aria-hidden="true">*</span></label>
                <input id="checkout-nombre" className="form-control" name="nombre" value={datos.nombre} onChange={cambiarDato} autoComplete="given-name" maxLength="50" required />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label" htmlFor="checkout-apellidos">Apellidos <span aria-hidden="true">*</span></label>
                <input id="checkout-apellidos" className="form-control" name="apellidos" value={datos.apellidos} onChange={cambiarDato} autoComplete="family-name" maxLength="100" required />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label" htmlFor="checkout-email">Correo <span aria-hidden="true">*</span></label>
                <input id="checkout-email" type="email" className="form-control" name="email" value={datos.email} onChange={cambiarDato} autoComplete="email" maxLength="100" required />
              </div>
            </div>
          </section>

          <section className="checkout-section" aria-labelledby="checkout-delivery-title">
            <h2 id="checkout-delivery-title" className="h4 fw-bold">Dirección de entrega de los productos</h2>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="checkout-direccion">Dirección <span aria-hidden="true">*</span></label>
                <input id="checkout-direccion" className="form-control" name="direccion" value={datos.direccion} onChange={cambiarDato} autoComplete="street-address" maxLength="150" required />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="checkout-piso">Piso (opcional)</label>
                <input id="checkout-piso" className="form-control" name="piso" value={datos.piso} onChange={cambiarDato} autoComplete="address-line2" maxLength="50" />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="checkout-region">Región <span aria-hidden="true">*</span></label>
                <select id="checkout-region" className="form-select" name="region" value={datos.region} onChange={cambiarDato} required>
                  {regionesChile.map(({ region }) => <option key={region} value={region}>{region}</option>)}
                </select>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="checkout-comuna">Comuna <span aria-hidden="true">*</span></label>
                <select id="checkout-comuna" className="form-select" name="comuna" value={datos.comuna} onChange={cambiarDato} required>
                  {comunasDisponibles.map((comuna) => <option key={comuna} value={comuna}>{comuna}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="checkout-indicaciones">Indicaciones para la entrega (opcional)</label>
                <textarea id="checkout-indicaciones" className="form-control" name="indicaciones" value={datos.indicaciones} onChange={cambiarDato} maxLength="300" rows="3" placeholder="Ej.: entre calles, color del edificio, no tiene timbre." />
              </div>
            </div>
          </section>

          <div className="checkout-paybar">
            <div><span>Total a pagar</span><strong>{formatoPrecio(subtotal)}</strong></div>
            <button className="btn btn-madera" type="submit">Pagar ahora {formatoPrecio(subtotal)}</button>
          </div>
          <Link to="/carrito" className="btn btn-outline-madera">Volver al carrito</Link>
        </form>
      </div>
    </main>
  );
}
