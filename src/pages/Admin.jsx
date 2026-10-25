
import { useState } from 'react';

import {
  obtenerProductos,
  guardarProducto,
  eliminarProducto
} from '../data/mockData';

// Formulario inicial
const productoInicial = {
  codigo: '',
  nombre: '',
  categoria: 'Muebles',
  material: '',
  tiempo: 1,
  precio: 0,
  stock: 0,
  stockCritico: 5,
  imagen: ''
};

// Formato de precios chilenos
const formatoPrecio = (valor) =>
  '$' + Number(valor).toLocaleString('es-CL');

// Diseño del botón principal
const estiloGuardar = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  minHeight: '52px',
  padding: '13px 26px',
  background: 'linear-gradient(110deg, #5c3a21, #8c5a32)',
  color: '#ffffff',
  border: '1px solid #8c5a32',
  borderRadius: '10px',
  fontSize: '15px',
  fontWeight: '700',
  cursor: 'pointer',
  boxShadow: '0 5px 15px rgba(92, 58, 33, 0.18)'
};

// Diseño del botón secundario
const estiloLimpiar = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  minHeight: '52px',
  padding: '13px 26px',
  background: '#f8f4ef',
  color: '#5c3a21',
  border: '1px solid #cbb9a8',
  borderRadius: '10px',
  fontSize: '15px',
  fontWeight: '600',
  cursor: 'pointer'
};

export default function Admin() {

  // Productos registrados
  const [productos, setProductos] = useState(obtenerProductos);

  // Modo de edición
  const [editando, setEditando] = useState(false);

  // Datos del formulario
  const [producto, setProducto] = useState({
    ...productoInicial
  });

  // Buscador y mensajes
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState(null);

  // Actualizar campos
  const manejarCambio = (e) => {
    const { name, value } = e.target;

    const camposNumericos = [
      'tiempo',
      'precio',
      'stock',
      'stockCritico'
    ];

    setProducto((anterior) => ({
      ...anterior,
      [name]: camposNumericos.includes(name)
        ? Number(value)
        : value
    }));
  };

  // Limpiar formulario
  const limpiarFormulario = () => {
    setProducto({ ...productoInicial });
    setEditando(false);
    setMensaje(null);
  };

  // Validaciones de productos
  const validarProducto = (datos) => {

    if (
      !datos.codigo ||
      !datos.nombre ||
      !datos.categoria ||
      !datos.material ||
      !datos.imagen
    ) {
      return 'Debes completar todos los campos obligatorios.';
    }

    if (
      !Number.isInteger(datos.tiempo) ||
      datos.tiempo < 1
    ) {
      return 'El tiempo de fabricación debe ser al menos 1 día.';
    }

    if (
      !Number.isInteger(datos.precio) ||
      datos.precio < 0
    ) {
      return 'El precio debe ser un número entero mayor o igual a cero.';
    }

    if (
      !Number.isInteger(datos.stock) ||
      datos.stock < 0
    ) {
      return 'El stock debe ser un número entero mayor o igual a cero.';
    }

    if (
      !Number.isInteger(datos.stockCritico) ||
      datos.stockCritico < 0
    ) {
      return 'El stock crítico debe ser un número entero válido.';
    }

    return null;
  };

  // Agregar o actualizar producto
  const manejarEnvio = (e) => {
    e.preventDefault();
    setMensaje(null);

    const productoGuardar = {
      ...producto,
      codigo: producto.codigo.trim().toUpperCase(),
      nombre: producto.nombre.trim(),
      material: producto.material.trim(),
      imagen: producto.imagen.trim()
    };

    const error = validarProducto(productoGuardar);

    if (error) {
      setMensaje({
        tipo: 'danger',
        texto: error
      });
      return;
    }

    // Evitar códigos duplicados
    const existe = productos.some(
      (p) => p.codigo === productoGuardar.codigo
    );

    if (existe && !editando) {
      setMensaje({
        tipo: 'danger',
        texto: 'Ya existe un producto con ese código.'
      });
      return;
    }

    try {
      const productosActualizados = guardarProducto(
        productoGuardar
      );

      setProductos(productosActualizados);

      setProducto({ ...productoInicial });
      setEditando(false);

      setMensaje({
        tipo: 'success',
        texto: editando
          ? 'Producto actualizado correctamente.'
          : 'Producto agregado correctamente.'
      });

    } catch {
      setMensaje({
        tipo: 'danger',
        texto: 'No se pudo guardar el producto.'
      });
    }
  };

  // Editar producto
  const editarProducto = (prod) => {
    setProducto({ ...prod });
    setEditando(true);
    setMensaje(null);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Eliminar producto
  const borrarProducto = (codigo) => {

    const confirmar = window.confirm(
      `¿Estás seguro de eliminar el producto ${codigo}?`
    );

    if (!confirmar) return;

    try {
      const productosActualizados = eliminarProducto(codigo);

      setProductos(productosActualizados);

      if (producto.codigo === codigo) {
        limpiarFormulario();
      }

      setMensaje({
        tipo: 'success',
        texto: 'Producto eliminado correctamente.'
      });

    } catch {
      setMensaje({
        tipo: 'danger',
        texto: 'No se pudo eliminar el producto.'
      });
    }
  };

  // Filtrar productos
  const productosFiltrados = productos.filter((p) => {
    const texto = busqueda.toLowerCase().trim();

    return (
      p.nombre.toLowerCase().includes(texto) ||
      p.codigo.toLowerCase().includes(texto) ||
      p.categoria.toLowerCase().includes(texto)
    );
  });

  // Indicadores
  const totalProductos = productos.length;

  const productosCriticos = productos.filter(
    (p) => p.stock > 0 && p.stock <= p.stockCritico
  ).length;

  const productosAgotados = productos.filter(
    (p) => p.stock <= 0
  ).length;

  return (
    <main className="container-fluid px-3 px-md-5 py-5">

      {/* ENCABEZADO */}
      <div className="mb-4">

        <h1
          className="fw-bold"
          style={{ color: '#2c1a0e' }}
        >
          Panel de Administración
        </h1>

        <p className="text-muted">
          Gestiona los productos, precios e inventario
          de Maderas Finas.
        </p>

      </div>

      {/* INDICADORES */}
      <div className="row g-3 mb-5">

        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">

              <p className="text-muted mb-2">
                Productos registrados
              </p>

              <h2
                className="fw-bold"
                style={{ color: '#5c3a21' }}
              >
                {totalProductos}
              </h2>

            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">

              <p className="text-muted mb-2">
                Productos con stock crítico
              </p>

              <h2 className="fw-bold text-warning">
                {productosCriticos}
              </h2>

            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">

              <p className="text-muted mb-2">
                Productos agotados
              </p>

              <h2 className="fw-bold text-danger">
                {productosAgotados}
              </h2>

            </div>
          </div>
        </div>

      </div>

      {/* FORMULARIO */}
      <div className="card shadow-sm mb-5">

        <div
          className="card-header fw-bold py-3"
          style={{
            backgroundColor: '#5c3a21',
            color: '#ffffff'
          }}
        >
          {editando
            ? 'Editar producto'
            : 'Registrar nuevo producto'}
        </div>

        <div className="card-body p-4">

          {mensaje && (
            <div
              className={`alert alert-${mensaje.tipo}`}
              role="alert"
            >
              {mensaje.texto}
            </div>
          )}

          <form onSubmit={manejarEnvio}>

            {/* INFORMACIÓN GENERAL */}
            <h5 className="border-bottom pb-2 mb-4">
              Información del producto
            </h5>

            <div className="row g-3">

              {/* CÓDIGO */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Código
                </label>

                <input
                  className="form-control"
                  type="text"
                  name="codigo"
                  value={producto.codigo}
                  onChange={manejarCambio}
                  disabled={editando}
                  placeholder="MF-001"
                  maxLength={30}
                  required
                />
              </div>

              {/* NOMBRE */}
              <div className="col-md-8">
                <label className="form-label fw-semibold">
                  Nombre del producto
                </label>

                <input
                  className="form-control"
                  type="text"
                  name="nombre"
                  value={producto.nombre}
                  onChange={manejarCambio}
                  placeholder="Mesa de comedor"
                  maxLength={120}
                  required
                />
              </div>

              {/* CATEGORÍA */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Categoría
                </label>

                <select
                  className="form-select"
                  name="categoria"
                  value={producto.categoria}
                  onChange={manejarCambio}
                  required
                >
                  <option value="Muebles">
                    Muebles
                  </option>

                  <option value="Oficina">
                    Oficina
                  </option>
                </select>
              </div>

              {/* MATERIAL */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Material
                </label>

                <input
                  className="form-control"
                  type="text"
                  name="material"
                  value={producto.material}
                  onChange={manejarCambio}
                  placeholder="Madera de roble"
                  maxLength={100}
                  required
                />
              </div>

              {/* FABRICACIÓN */}
              <div className="col-12 mt-4">
                <h5 className="border-bottom pb-2">
                  Fabricación
                </h5>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Tiempo de fabricación (días)
                </label>

                <input
                  className="form-control"
                  type="number"
                  name="tiempo"
                  min="1"
                  step="1"
                  value={producto.tiempo}
                  onChange={manejarCambio}
                  required
                />
              </div>

              {/* PRECIO E INVENTARIO */}
              <div className="col-12 mt-4">
                <h5 className="border-bottom pb-2">
                  Precio e inventario
                </h5>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Precio (CLP)
                </label>

                <input
                  className="form-control"
                  type="number"
                  name="precio"
                  min="0"
                  step="1"
                  value={producto.precio}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Stock disponible
                </label>

                <input
                  className="form-control"
                  type="number"
                  name="stock"
                  min="0"
                  step="1"
                  value={producto.stock}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Stock crítico
                </label>

                <input
                  className="form-control"
                  type="number"
                  name="stockCritico"
                  min="0"
                  step="1"
                  value={producto.stockCritico}
                  onChange={manejarCambio}
                  required
                />
              </div>

              {/* IMAGEN */}
              <div className="col-12 mt-4">
                <h5 className="border-bottom pb-2">
                  Imagen del producto
                </h5>
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">
                  Nombre de imagen
                </label>

                <input
                  className="form-control"
                  type="text"
                  name="imagen"
                  placeholder="mesa-comedor.jpg"
                  value={producto.imagen}
                  onChange={manejarCambio}
                  required
                />

                <small className="text-muted">
                  Ingresa el nombre del archivo de imagen
                  correspondiente al producto.
                </small>
              </div>

            </div>

            {/* BOTONES ACTUALIZADOS */}
            <div className="d-flex flex-wrap gap-3 mt-4">

              {/* AGREGAR O GUARDAR */}
              <button
                type="submit"
                className="btn admin-btn-guardar"
                style={estiloGuardar}
              >
                <span aria-hidden="true">
                  {editando ? '✓' : '⊕'}
                </span>

                <span>
                  {editando
                    ? 'Guardar cambios'
                    : 'Agregar producto'}
                </span>
              </button>

              {/* LIMPIAR O CANCELAR */}
              <button
                type="button"
                className="btn admin-btn-limpiar"
                style={estiloLimpiar}
                onClick={limpiarFormulario}
              >
                <span aria-hidden="true">↻</span>

                <span>
                  {editando
                    ? 'Cancelar edición'
                    : 'Limpiar formulario'}
                </span>
              </button>

            </div>

          </form>
        </div>
      </div>

      {/* TABLA DE PRODUCTOS */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

        <div>
          <h3 className="fw-bold mb-1">
            Productos registrados
          </h3>

          <p className="text-muted mb-0">
            Consulta y administra el catálogo.
          </p>
        </div>

        <div style={{ width: '100%', maxWidth: 350 }}>
          <input
            className="form-control"
            type="search"
            placeholder="Buscar producto o código..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

      </div>

      <div className="card shadow-sm overflow-hidden">

        <div className="table-responsive">

          <table className="table table-hover align-middle mb-0">

            <thead>
              <tr className="table-dark">
                <th className="p-3">Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>

              {productosFiltrados.map((prod) => {

                const agotado = prod.stock <= 0;

                const critico =
                  !agotado &&
                  prod.stock <= prod.stockCritico;

                return (
                  <tr key={prod.codigo}>

                    <td className="p-3 fw-semibold">
                      {prod.codigo}
                    </td>

                    <td>{prod.nombre}</td>

                    <td>{prod.categoria}</td>

                    <td className="fw-semibold">
                      {formatoPrecio(prod.precio)}
                    </td>

                    <td>{prod.stock}</td>

                    <td>

                      {agotado ? (
                        <span className="badge bg-danger">
                          Agotado
                        </span>
                      ) : critico ? (
                        <span className="badge bg-warning text-dark">
                          Stock crítico
                        </span>
                      ) : (
                        <span className="badge bg-success">
                          Disponible
                        </span>
                      )}

                    </td>

                    <td>
                      <div className="d-flex gap-2">

                        <button
                          type="button"
                          className="btn btn-outline-warning btn-sm"
                          onClick={() => editarProducto(prod)}
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => borrarProducto(prod.codigo)}
                        >
                          Eliminar
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })}

              {productosFiltrados.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-5 text-muted"
                  >
                    No se encontraron productos.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>
      </div>

    </main>
  );
}