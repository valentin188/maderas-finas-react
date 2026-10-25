
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  obtenerProductos,
  guardarCarrito,
  obtenerCarrito
} from '../data/mockData';

export default function Productos({ setCarrito }) {

  // Obtener los productos del catálogo
  const [productos] = useState(obtenerProductos);

  // Buscador de productos
  const [busqueda, setBusqueda] = useState('');

  // Mensaje de confirmación
  const [mensaje, setMensaje] = useState('');
  const [productoAgregado, setProductoAgregado] = useState('');
  const temporizadorAgregado = useRef(null);

  useEffect(() => () => window.clearTimeout(temporizadorAgregado.current), []);

  // Formato de precios en pesos chilenos
  const formatoPrecio = (precio) => {
    return '$' + Number(precio).toLocaleString('es-CL');
  };

  // Agregar productos al carrito
  const agregarAlCarrito = (producto) => {

    const carritoActual = obtenerCarrito();

    const existe = carritoActual.find(
      (item) => item.codigo === producto.codigo
    );

    // Validar que exista stock
    if (producto.stock <= 0) {
      setMensaje(
        `Lo sentimos, "${producto.nombre}" está agotado.`
      );
      return;
    }

    // Evitar superar el stock disponible
    if (
      existe &&
      (existe.cantidad || 1) >= producto.stock
    ) {
      setMensaje(
        `No puedes agregar más unidades de "${producto.nombre}". Stock máximo alcanzado.`
      );
      return;
    }

    let nuevoCarrito;

    // Si existe, aumentar cantidad
    if (existe) {

      nuevoCarrito = carritoActual.map((item) =>
        item.codigo === producto.codigo
          ? {
              ...item,
              cantidad: (item.cantidad || 1) + 1
            }
          : item
      );

    } else {

      // Si no existe, agregarlo al carrito
      nuevoCarrito = [
        ...carritoActual,
        {
          ...producto,
          cantidad: 1
        }
      ];

    }

    // Guardar el carrito
    guardarCarrito(nuevoCarrito);

    // Actualizar contador del menú
    if (setCarrito) {
      setCarrito(nuevoCarrito);
    }

    setProductoAgregado(producto.codigo);
    window.clearTimeout(temporizadorAgregado.current);
    temporizadorAgregado.current = window.setTimeout(() => setProductoAgregado(''), 2200);

    // Mostrar mensaje de confirmación
    setMensaje(
      `"${producto.nombre}" se agregó correctamente al carrito.`
    );
  };

  // Filtrar por nombre o categoría
  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <main className="container-fluid px-3 px-md-5 py-5">

      {/* ENCABEZADO */}
      <div className="mb-4">

        <h1
          className="fw-bold"
          style={{ color: '#2c1a0e' }}
        >
          Catálogo de Productos
        </h1>

        <p className="text-muted">
          Descubre nuestros muebles de madera,
          elaborados con calidad y dedicación.
        </p>

      </div>

      {/* MENSAJE DE CONFIRMACIÓN */}
      {mensaje && (

        <div
          className="alert alert-info alert-dismissible fade show"
          role="alert"
        >

          {mensaje}

          <button
            type="button"
            className="btn-close"
            aria-label="Cerrar mensaje"
            onClick={() => setMensaje('')}
          />

        </div>

      )}

      {/* BUSCADOR */}
      <div className="row mb-4">

        <div className="col-12 col-md-6">

          <input
            type="search"
            className="form-control"
            placeholder="Buscar por nombre o categoría..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

        </div>

      </div>

      {/* CATÁLOGO DE PRODUCTOS */}
      <div className="row g-4">

        {productosFiltrados.map((prod) => (

          <div
            key={prod.codigo}
            className="col-12 col-md-6 col-lg-4"
          >

            <div className="card h-100 shadow-sm">

              <div className="card-body d-flex flex-column p-4">

                {/* NOMBRE DEL PRODUCTO */}
                <h5 className="card-title fw-bold">
                  {prod.nombre}
                </h5>

                {/* CATEGORÍA */}
                <p className="card-text text-muted mb-1">
                  Categoría: {prod.categoria}
                </p>

                {/* MATERIAL */}
                <p className="card-text text-muted mb-2">
                  Material: {prod.material}
                </p>

                {/* PRECIO */}
                <p
                  className="fw-bold fs-4 mb-3"
                  style={{ color: '#5c3a21' }}
                >
                  {formatoPrecio(prod.precio)}
                </p>

                {/* STOCK DISPONIBLE */}
                <span
                  className={`badge mb-4 align-self-start ${
                    prod.stock <= prod.stockCritico
                      ? 'badge-critico'
                      : 'badge-normal'
                  }`}
                >

                  {prod.stock <= 0
                    ? 'Producto agotado'
                    : `Stock: ${prod.stock}`}

                  {prod.stock > 0 &&
                    prod.stock <= prod.stockCritico &&
                    ' (Stock Crítico)'}

                </span>

                <Link
                  className="btn btn-outline-madera w-100 mb-2"
                  to={`/productos/${prod.codigo}`}
                >
                  Ver detalle
                </Link>

                {/* BOTÓN AGREGAR AL CARRITO */}
                <button
                  type="button"
                  className={`btn btn-agregar-carrito w-100 mt-auto ${productoAgregado === prod.codigo ? 'is-added' : ''}`}
                  disabled={prod.stock <= 0}
                  onClick={() => agregarAlCarrito(prod)}
                  aria-live="polite"
                >
                  <span>{prod.stock <= 0
                    ? 'Producto agotado'
                    : productoAgregado === prod.codigo ? 'Agregado al carrito ✓' : 'Agregar al carrito'}</span>
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* SIN RESULTADOS */}
      {productosFiltrados.length === 0 && (

        <div className="text-center py-5">

          <h4 className="fw-bold">
            No se encontraron productos
          </h4>

          <p className="text-muted">
            Intenta buscar con otro nombre o categoría.
          </p>

        </div>

      )}

    </main>
  );
}
