import { useState } from 'react';
import { Link } from 'react-router-dom';
import { eliminarProducto, guardarProducto, obtenerProductos } from '../../data/mockData';

const PRODUCTO_VACIO = { codigo: '', nombre: '', categoria: 'Muebles', material: '', tiempo: 1, precio: 0, stock: 0, stockCritico: 5, imagen: '' };
const formatoPrecio = (valor) => `$${Number(valor).toLocaleString('es-CL')}`;

export default function ProductosAdmin() {
  const [productos, setProductos] = useState(() => obtenerProductos());
  const [producto, setProducto] = useState(PRODUCTO_VACIO);
  const [editando, setEditando] = useState(false);

  const cambiar = (e) => {
    const { name, value } = e.target;
    setProducto(actual => ({ ...actual, [name]: value }));
  };

  const limpiar = () => { setProducto(PRODUCTO_VACIO); setEditando(false); };

  const guardar = (e) => {
    e.preventDefault();
    const codigo = producto.codigo.trim().toUpperCase();
    const nombre = producto.nombre.trim();
    const material = producto.material.trim();
    const imagen = producto.imagen.trim();
    const tiempo = Number(producto.tiempo);
    const precio = Number(producto.precio);
    const stock = Number(producto.stock);
    const stockCritico = Number(producto.stockCritico);
    if (!codigo || !nombre || !material || !imagen || !Number.isInteger(tiempo) || tiempo < 1 || !Number.isFinite(precio) || precio < 0 || !Number.isInteger(stock) || stock < 0 || !Number.isInteger(stockCritico) || stockCritico < 0) {
      alert('Completa todos los campos correctamente.');
      return;
    }
    if (!editando && productos.some(p => p.codigo.toUpperCase() === codigo)) {
      alert('Ya existe un producto con ese código.');
      return;
    }
    const actualizados = guardarProducto({ ...producto, codigo, nombre, material, imagen, tiempo, precio, stock, stockCritico });
    setProductos(actualizados);
    limpiar();
    alert(editando ? 'Producto actualizado correctamente.' : 'Producto agregado correctamente.');
  };

  const eliminar = (codigo) => {
    if (!window.confirm(`¿Deseas eliminar el producto ${codigo}?`)) return;
    setProductos(eliminarProducto(codigo));
    if (producto.codigo.toUpperCase() === codigo.toUpperCase()) limpiar();
  };

  const productosStockCritico = productos.filter(p => Number(p.stock) <= Number(p.stockCritico));

  return (
    <section className="container py-5">
      <Link to="/admin" className="btn btn-outline-madera mb-3">Volver al panel</Link>
      <p className="eyebrow mb-1">Administración</p>
      <h1 className="orders-title mb-4">Gestión de productos</h1>

      {productosStockCritico.length > 0 && <section className="stock-alert mb-4" role="alert" aria-live="polite">
        <h2 className="h5 fw-bold mb-2">Alerta de stock crítico</h2>
        <p className="mb-2">Estos productos alcanzaron o están bajo su nivel mínimo:</p>
        <ul className="mb-0">{productosStockCritico.map(p => <li key={p.codigo}><strong>{p.nombre}</strong>: {p.stock} unidades (mínimo {p.stockCritico}).</li>)}</ul>
      </section>}

      <div className="card shadow-sm mb-4">
        <div className="card-header fw-bold">{editando ? 'Editar producto' : 'Agregar producto'}</div>
        <div className="card-body">
          <form onSubmit={guardar}>
            <div className="row g-3">
              <div className="col-12 col-md-4"><label className="form-label" htmlFor="producto-codigo">Código</label><input id="producto-codigo" className="form-control" name="codigo" value={producto.codigo} onChange={cambiar} disabled={editando} maxLength="20" required /></div>
              <div className="col-12 col-md-8"><label className="form-label" htmlFor="producto-nombre">Nombre</label><input id="producto-nombre" className="form-control" name="nombre" value={producto.nombre} onChange={cambiar} maxLength="100" required /></div>
              <div className="col-12 col-md-4"><label className="form-label" htmlFor="producto-categoria">Categoría</label><select id="producto-categoria" className="form-select" name="categoria" value={producto.categoria} onChange={cambiar} required><option>Muebles</option><option>Oficina</option></select></div>
              <div className="col-12 col-md-4"><label className="form-label" htmlFor="producto-material">Material</label><input id="producto-material" className="form-control" name="material" value={producto.material} onChange={cambiar} maxLength="80" required /></div>
              <div className="col-12 col-md-4"><label className="form-label" htmlFor="producto-tiempo">Fabricación (días)</label><input id="producto-tiempo" type="number" className="form-control" min="1" step="1" name="tiempo" value={producto.tiempo} onChange={cambiar} required /></div>
              <div className="col-12 col-md-4"><label className="form-label" htmlFor="producto-precio">Precio</label><input id="producto-precio" type="number" className="form-control" min="0" step="1" name="precio" value={producto.precio} onChange={cambiar} required /></div>
              <div className="col-12 col-md-4"><label className="form-label" htmlFor="producto-stock">Stock</label><input id="producto-stock" type="number" className="form-control" min="0" step="1" name="stock" value={producto.stock} onChange={cambiar} required /></div>
              <div className="col-12 col-md-4"><label className="form-label" htmlFor="producto-stock-critico">Stock crítico</label><input id="producto-stock-critico" type="number" className="form-control" min="0" step="1" name="stockCritico" value={producto.stockCritico} onChange={cambiar} required /></div>
              <div className="col-12"><label className="form-label" htmlFor="producto-imagen">Nombre de imagen</label><input id="producto-imagen" className="form-control" name="imagen" placeholder="mesa-comedor.jpg" value={producto.imagen} onChange={cambiar} required /></div>
            </div>
            <div className="d-flex flex-wrap gap-2 mt-4">
              <button className="btn btn-madera" type="submit">{editando ? 'Guardar cambios' : 'Agregar producto'}</button>
              {editando && <button className="btn btn-outline-madera" type="button" onClick={limpiar}>Cancelar</button>}
            </div>
          </form>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark"><tr><th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead>
          <tbody>
            {productos.map(p => <tr key={p.codigo}><td>{p.codigo}</td><td>{p.nombre}</td><td>{p.categoria}</td><td>{formatoPrecio(p.precio)}</td><td>{p.stock}</td><td><div className="d-flex flex-wrap gap-2"><button className="btn btn-outline-madera btn-sm" type="button" onClick={() => { setProducto({ ...p }); setEditando(true); }}>Editar</button><button className="btn btn-outline-danger btn-sm" type="button" onClick={() => eliminar(p.codigo)}>Eliminar</button></div></td></tr>)}
            {!productos.length && <tr><td colSpan="6" className="text-center">No hay productos registrados.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
