
import { Link } from 'react-router-dom';
import { obtenerProductos } from '../data/mockData';

// Formato de precios en pesos chilenos
const formatoPrecio = (valor) =>
  '$' + Number(valor).toLocaleString('es-CL');

export default function Categorias() {

  // Obtener productos registrados
  const productos = obtenerProductos();

  // Obtener categorías sin repetir
  const categorias = [
    ...new Set(
      productos.map((producto) => producto.categoria)
    )
  ];

  return (
    <main className="container-fluid px-3 px-md-5 py-5">

      {/* ENCABEZADO */}
      <div className="mb-5">

        <h1
          className="fw-bold"
          style={{ color: '#2c1a0e' }}
        >
          Categorías de Productos
        </h1>

        <p className="text-muted">
          Explora nuestros muebles de madera
          organizados por categoría.
        </p>

      </div>

      {/* CATEGORÍAS */}
      {categorias.map((categoria) => {

        const productosCategoria = productos.filter(
          (producto) => producto.categoria === categoria
        );

        return (
          <section key={categoria} className="mb-5">

            {/* TÍTULO DE CATEGORÍA */}
            <div
              className="mb-4 pb-3"
              style={{
                borderBottom: '2px solid #d9c4b0'
              }}
            >

              <h2
                className="fw-bold mb-2"
                style={{ color: '#5c3a21' }}
              >
                {categoria}
              </h2>

              <p className="text-muted mb-0">
                {productosCategoria.length}
                {' '}
                {productosCategoria.length === 1
                  ? 'producto disponible en el catálogo'
                  : 'productos disponibles en el catálogo'}
              </p>

            </div>

            {/* PRODUCTOS DE LA CATEGORÍA */}
            <div className="row g-4">

              {productosCategoria.map((producto) => (

                <div
                  key={producto.codigo}
                  className="col-12 col-md-6 col-lg-4"
                >

                  <article
                    className="card h-100 shadow-sm"
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e6d9cb',
                      borderRadius: '15px',
                      overflow: 'hidden'
                    }}
                  >

                    <div className="card-body d-flex flex-column p-4">

                      {/* NOMBRE */}
                      <h5
                        className="fw-bold mb-3"
                        style={{ color: '#2c1a0e' }}
                      >
                        {producto.nombre}
                      </h5>

                      {/* MATERIAL */}
                      <p className="text-muted mb-2">
                        Material: {producto.material}
                      </p>

                      {/* FABRICACIÓN */}
                      <p className="text-muted mb-3">
                        Tiempo de fabricación:
                        {' '}
                        {producto.tiempo} días
                      </p>

                      {/* PRECIO */}
                      <h4
                        className="fw-bold mb-3"
                        style={{ color: '#5c3a21' }}
                      >
                        {formatoPrecio(producto.precio)}
                      </h4>

                      {/* STOCK */}
                      <p className="mb-4">
                        <span
                          className={`badge ${
                            producto.stock <= 0
                              ? 'bg-danger'
                              : producto.stock <= producto.stockCritico
                                ? 'bg-warning text-dark'
                                : 'bg-success'
                          }`}
                        >
                          {producto.stock <= 0
                            ? 'Producto agotado'
                            : `Stock disponible: ${producto.stock}`}
                        </span>
                      </p>

                      {/* BOTÓN VER PRODUCTOS */}
                      <Link
                        to="/productos"
                        className="btn w-100 mt-auto"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          minHeight: '52px',
                          padding: '12px 20px',
                          background:
                            'linear-gradient(110deg, #5c3a21, #8c5a32)',
                          color: '#ffffff',
                          border: '1px solid #8c5a32',
                          borderRadius: '10px',
                          fontWeight: '700',
                          textDecoration: 'none',
                          boxShadow:
                            '0 5px 15px rgba(92, 58, 33, 0.15)'
                        }}
                      >
                        <span>Ver en catálogo</span>
                        <span aria-hidden="true">→</span>
                      </Link>

                    </div>

                  </article>

                </div>

              ))}

            </div>

          </section>
        );
      })}

      {/* SIN PRODUCTOS */}
      {productos.length === 0 && (

        <div className="text-center py-5">

          <h3 className="fw-bold">
            No hay productos registrados
          </h3>

          <p className="text-muted">
            Actualmente no existen productos
            disponibles para mostrar.
          </p>

        </div>

      )}

    </main>
  );
}