
import React, { useState, useEffect } from 'react';
import {
  obtenerProductos,
  guardarProducto,
  eliminarProducto
} from '../data/mockData';

export default function Admin() {
  const [productos, setProductos] = useState([]);
  const [editando, setEditando] = useState(false);
  const [producto, setProducto] = useState({
    codigo: '',
    nombre: '',
    categoria: 'Muebles',
    material: '',
    tiempo: 1,
    precio: 0,
    stock: 0,
    stockCritico: 5,
    imagen: ''
  });

  useEffect(() => {
    setProductos(obtenerProductos());
  }, []);

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setProducto({
      ...producto,
      [name]: ['tiempo', 'precio', 'stock', 'stockCritico'].includes(name)
        ? Number(value)
        : value
    });
  };

  const limpiarFormulario = () => {
    setProducto({
      codigo: '',
      nombre: '',
      categoria: 'Muebles',
      material: '',
      tiempo: 1,
      precio: 0,
      stock: 0,
      stockCritico: 5,
      imagen: ''
    });
    setEditando(false);
  };

  const manejarEnvio = (e) => {
    e.preventDefault();

    const codigo = producto.codigo.trim().toUpperCase();
    const nombre = producto.nombre.trim();
    const material = producto.material.trim();
    const imagen = producto.imagen.trim();

    if (
      !codigo ||
      !nombre ||
      !material ||
      !imagen ||
      producto.tiempo < 1 ||
      producto.precio < 0 ||
      producto.stock < 0 ||
      producto.stockCritico < 0
    ) {
      alert('Completa todos los campos correctamente.');
      return;
    }

    const productoGuardar = {
      ...producto,
      codigo,
      nombre,
      material,
      imagen
    };

    const existe = productos.some(p => p.codigo === codigo);

    if (existe && !editando) {
      alert('Ya existe un producto con ese código.');
      return;
    }

    const productosActualizados = guardarProducto(productoGuardar);
    setProductos(productosActualizados);
    limpiarFormulario();

    alert(editando
      ? 'Producto actualizado correctamente.'
      : 'Producto agregado correctamente.');
  };

  const editarProducto = (prod) => {
    setProducto({ ...prod });
    setEditando(true);
  };

  const borrarProducto = (codigo) => {
    if (window.confirm(`¿Deseas eliminar el producto ${codigo}?`)) {
      const productosActualizados = eliminarProducto(codigo);
      setProductos(productosActualizados);

      if (producto.codigo === codigo) {
        limpiarFormulario();
      }
    }
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">⚙️ Panel de Administración</h2>

      <div className="card shadow-sm mb-5">
        <div className="card-header fw-bold">
          {editando ? 'Editar Producto' : 'Agregar Producto'}
        </div>

        <div className="card-body">
          <form onSubmit={manejarEnvio}>
            <div className="col-12">
                <h5 className="border-bottom pb-2 mb-1">Información del producto</h5>
            </div>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-semibold">Código</label>
                <input
                  className="form-control"
                  name="codigo"
                  value={producto.codigo}
                  onChange={manejarCambio}
                  disabled={editando}
                  required
                />
              </div>

              <div className="col-md-8">
                <label className="form-label fw-semibold">Nombre</label>
                <input
                  className="form-control"
                  name="nombre"
                  value={producto.nombre}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Categoría</label>
                <select
                  className="form-select"
                  name="categoria"
                  value={producto.categoria}
                  onChange={manejarCambio}
                  required
                >
                  <option value="Muebles">Muebles</option>
                  <option value="Oficina">Oficina</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Material</label>
                <input
                  className="form-control"
                  name="material"
                  value={producto.material}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="col-12">
                <h5 className="border-bottom pb-2 mb-1">Fabricación</h5>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Tiempo de fabricación (días)</label>
                <input
                  className="form-control"
                  type="number"
                  min="1"
                  name="tiempo"
                  value={producto.tiempo}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="col-12">
                <h5 className="border-bottom pb-2 mb-1">Precio e inventario</h5>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Precio</label>
                <input
                  className="form-control"
                  type="number"
                  min="0"
                  name="precio"
                  value={producto.precio}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Stock</label>
                <input
                  className="form-control"
                  type="number"
                  min="0"
                  name="stock"
                  value={producto.stock}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Stock crítico</label>
                <input
                  className="form-control"
                  type="number"
                  min="0"
                  name="stockCritico"
                  value={producto.stockCritico}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">Nombre de imagen</label>
                <input
                  className="form-control"
                  name="imagen"
                  placeholder="mesa-comedor.jpg"
                  value={producto.imagen}
                  onChange={manejarCambio}
                  required
                />
              </div>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button className="btn btn-primary" type="submit">
                {editando ? 'Guardar Cambios' : 'Agregar Producto'}
              </button>

              {editando && (
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={limpiarFormulario}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <h3 className="mb-3">Productos registrados</h3>

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productos.map(prod => (
              <tr key={prod.codigo}>
                <td>{prod.codigo}</td>
                <td>{prod.nombre}</td>
                <td>{prod.categoria}</td>
                <td>${prod.precio.toLocaleString('cl-CL')}</td>
                <td>{prod.stock}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-warning btn-sm"
                      type="button"
                      onClick={() => editarProducto(prod)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      type="button"
                      onClick={() => borrarProducto(prod.codigo)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {productos.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">
                  No hay productos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
