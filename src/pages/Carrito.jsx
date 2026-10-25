import { Link } from 'react-router-dom';
import {
  guardarCarrito,
  obtenerProductos
} from '../data/mockData';

// Formato de precios en pesos chilenos
const dinero = (valor) =>
  '$' + Number(valor).toLocaleString('es-CL');

export default function Carrito({ carrito, setCarrito }) {

  // Guardar los cambios del carrito
  const actualizar = (nuevoCarrito) => {
    guardarCarrito(nuevoCarrito);
    setCarrito(nuevoCarrito);
  };

  // Aumentar o disminuir cantidades
  const cambiarCantidad = (codigo, cambio) => {
    const catalogo = obtenerProductos();

    const nuevos = carrito.map((item) => {
      if (item.codigo !== codigo) {
        return item;
      }

      const producto = catalogo.find(
        (p) => p.codigo === codigo
      );

      const disponible = producto?.stock ?? 0;
      const siguiente = (item.cantidad || 1) + cambio;

      // Evitar cantidades inválidas
      if (siguiente < 1 || siguiente > disponible) {
        return item;
      }

      return {
        ...item,
        cantidad: siguiente
      };
    });

    actualizar(nuevos);
  };

  // Eliminar un producto del carrito
  const eliminar = (codigo) => {
    actualizar(
      carrito.filter(
        (item) => item.codigo !== codigo
      )
    );
  };

  // Vaciar todo el carrito
  const vaciarCarrito = () => {
    actualizar([]);
  };

  // Calcular unidades totales
  const unidades = carrito.reduce(
    (total, producto) =>
      total + (producto.cantidad || 1),
    0
  );

  // Calcular total de compra
  const totalCompra = carrito.reduce(
    (total, producto) =>
      total +
      producto.precio * (producto.cantidad || 1),
    0
  );

  // Consultar stock actualizado
  const catalogo = obtenerProductos();

  // Comprobar stock de todos los productos
  const stockValido = carrito.every((item) => {
    const actual = catalogo.find(
      (p) => p.codigo === item.codigo
    );

    return (
      actual &&
      Number.isInteger(item.cantidad) &&
      item.cantidad >= 1 &&
      item.cantidad <= actual.stock
    );
  });

  return (
    <main className="container-fluid pagina-carrito px-3 px-md-5 py-5">
      {/* Encabezado */}
      <div className="mb-4">

        <h1 className="fw-bold">
          Mi carrito de compras
        </h1>

        <p className="text-muted">
          Revisa los muebles que seleccionaste.
        </p>

      </div>

      {/* Carrito vacío */}
      {carrito.length === 0 ? (
        <div className="carrito-vacio p-5 text-center">
          <div
            className="mb-3"
            style={{ fontSize: '45px' }}
            aria-hidden="true"
          >
            🛒
          </div>

          <h3 className="fw-bold">
            Tu carrito está vacío
          </h3>

          <p className="text-muted my-3">
            Descubre nuestros muebles de madera fina.
          </p>

          {/* Botón ver productos */}
          <Link
            to="/productos"
            className="btn btn-ver-productos mt-3"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',

              minHeight: '55px',
              padding: '14px 30px',

              background:
                'linear-gradient(110deg, #5c3a21, #8c5a32)',

              color: '#ffffff',
              border: '1px solid #8c5a32',
              borderRadius: '11px',

              fontSize: '16px',
              fontWeight: '700',
              textDecoration: 'none',

              boxShadow:
                '0 6px 18px rgba(92, 58, 33, 0.20)',

              transition: 'all 0.2s ease'
            }}
          >

            <span aria-hidden="true">
            </span>

            <span>
              Ver productos
            </span>

            <span aria-hidden="true">
              →
            </span>

          </Link>
        </div>
      ) : (

        /* Carrito con productos */
        <div className="row g-4">
          {/* Listados de productos */}
          <div className="col-lg-8">
            {carrito.map((producto) => {
              const actual = catalogo.find(
                (p) => p.codigo === producto.codigo
              );
              const stock = actual?.stock ?? 0;
              const cantidad = producto.cantidad || 1;
              const subtotal =
                producto.precio * cantidad;
              return (

                <div
                  className="carrito-producto p-4 mb-3"
                  key={producto.codigo}
                >
                  {/* Información del producto */}
                  <div className="d-flex justify-content-between gap-3 flex-wrap">
                    <div>
                      <small className="text-muted">
                        Código: {producto.codigo}
                      </small>

                      <h4 className="fw-bold mt-2">
                        {producto.nombre}
                      </h4>

                      <p className="text-muted">
                        {producto.material}
                      </p>

                      <strong>
                        {dinero(producto.precio)} c/u
                      </strong>

                    </div>

                    {/* Eliminar productos */}
                    <button
                      type="button"
                      className="btn btn-outline-danger align-self-start"
                      onClick={() =>
                        eliminar(producto.codigo)
                      }
                    >
                      Eliminar
                    </button>
                  </div>
                  <hr />

                  {/* Cantidad y subtotal */}
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                    {/* Controles de cantidad */}
                    <div className="d-flex align-items-center gap-3">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        disabled={cantidad <= 1}
                        aria-label={`Disminuir cantidad de ${producto.nombre}`}
                        onClick={() =>
                          cambiarCantidad(
                            producto.codigo,
                            -1
                          )
                        }
                      >
                        −
                      </button>

                      <strong>
                        {cantidad}
                      </strong>

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        disabled={cantidad >= stock}
                        aria-label={`Aumentar cantidad de ${producto.nombre}`}
                        onClick={() =>
                          cambiarCantidad(
                            producto.codigo,
                            1
                          )
                        }
                      >
                        +
                      </button>

                    </div>

                    {/* Subtotal */}
                    <div className="text-end">
                      <small className="d-block text-muted">
                        Subtotal
                      </small>

                      <strong className="precio-carrito">
                        {dinero(subtotal)}
                      </strong>
                    </div>
                  </div>

                  {/* Advertencia de stock */}
                  {cantidad > stock && (
                    <div
                      className="alert alert-warning mt-3 mb-0"
                      role="alert"
                    >
                      La cantidad solicitada supera el stock disponible.
                      <br />
                      Reduce la cantidad o elimina este producto.
                    </div>
                  )}
                </div>
              );
            })}

            {/* Botones secundarios */}
            <div className="d-flex gap-2 flex-wrap mt-4">
              <Link
                to="/productos"
                className="btn btn-outline-secondary"
              >
                ← Seguir comprando
              </Link>

              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={vaciarCarrito}
              >
                Vaciar carrito
              </button>
            </div>
          </div>

          {/* Resumen de compra */}
          <div className="col-lg-4">
            <div className="carrito-resumen p-4">
              <h3 className="fs-4 fw-bold">
                Resumen de compra
              </h3>
              <hr />

              {/* Unidades */}
              <div className="d-flex justify-content-between mb-3">
                <span>
                  Unidades
                </span>

                <strong>
                  {unidades}
                </strong>

              </div>

              {/* Subtotal */}
              <div className="d-flex justify-content-between mb-3">
                <span>
                  Subtotal
                </span>

                <strong>
                  {dinero(totalCompra)}
                </strong>
              </div>
              <hr />

              {/* Total */}
              <div className="d-flex justify-content-between align-items-center">
                <strong>
                  Total
                </strong>

                <strong className="precio-carrito">
                  {dinero(totalCompra)}
                </strong>
              </div>

              {/* Información de envío */}
              <p className="text-muted small mt-3">
                El despacho se coordina por separado.
              </p>

              {/* Validación de stock */}
              {!stockValido && (
                <div
                  className="alert alert-warning small"
                  role="alert"
                >
                  Revisa las cantidades antes
                  de continuar con tu pedido.
                </div>
              )}

              {/* Botón continuar pedido */}
              {stockValido ? (
                <Link
                  to="/checkout"
                  className="btn btn-continuar-pedido w-100 mt-3"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',

                    minHeight: '62px',
                    padding: '14px 18px',

                    background:
                      'linear-gradient(110deg, #5c3a21, #8c5a32)',

                    color: '#ffffff',
                    border: '1px solid #8c5a32',
                    borderRadius: '12px',

                    fontSize: '15px',
                    fontWeight: '700',
                    textDecoration: 'none',

                    boxShadow:
                      '0 6px 18px rgba(92, 58, 33, 0.20)'
                  }}
                >

                  <span className="d-flex align-items-center gap-2">
                    <span aria-hidden="true">
                    </span>
                    Continuar con el pedido
                  </span>

                  <span
                    className="continuar-flecha"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              ) : (

                <button
                  type="button"
                  className="btn btn-secondary w-100 mt-3"
                  disabled
                >
                  Revisa el stock para continuar
                </button>
              )}

              <p className="texto-pedido-seguro">
                Siguiente paso: confirmar datos
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}