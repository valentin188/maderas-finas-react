import React, { useEffect, useState } from 'react';
import { obtenerProductos } from '../../data/mockData';
import { actualizarEstadoPedido, guardarPedido, obtenerPedidos } from '../../data/pedidos';
import { correoValido } from '../../data/validaciones';

const ESTADOS_PEDIDO = ['Pendiente', 'En preparación', 'Despachado', 'Entregado', 'Anulado'];

const formatoPrecio = (valor) => `$${Number(valor).toLocaleString('es-CL')}`;

export default function Pedidos() {
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [nuevoPedido, setNuevoPedido] = useState({ cliente: '', email: '', codigoProducto: '', cantidad: '1' });
  const [articulos, setArticulos] = useState([]);

  useEffect(() => {
    setProductos(obtenerProductos());
    setPedidos(obtenerPedidos());
  }, []);

  const totalPedido = articulos.reduce((total, articulo) => total + articulo.precio * articulo.cantidad, 0);

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setNuevoPedido(actual => ({ ...actual, [name]: value }));
  };

  const agregarArticulo = () => {
    const producto = productos.find(item => item.codigo === nuevoPedido.codigoProducto);
    const cantidad = Number(nuevoPedido.cantidad);

    if (!producto || !Number.isInteger(cantidad) || cantidad < 1) {
      alert('Selecciona un producto e ingresa una cantidad válida.');
      return;
    }

    setArticulos(actuales => {
      const existente = actuales.find(articulo => articulo.codigo === producto.codigo);
      if (existente) {
        return actuales.map(articulo => articulo.codigo === producto.codigo
          ? { ...articulo, cantidad: articulo.cantidad + cantidad }
          : articulo);
      }

      return [...actuales, {
        codigo: producto.codigo,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad,
      }];
    });
    setNuevoPedido(actual => ({ ...actual, codigoProducto: '', cantidad: '1' }));
  };

  const crearPedido = (evento) => {
    evento.preventDefault();
    const cliente = nuevoPedido.cliente.trim();
    const email = nuevoPedido.email.trim().toLowerCase();

    if (!cliente || cliente.length > 100 || !correoValido(email) || email.length > 100) {
      alert('Ingresa el nombre del cliente y un correo válido (@duoc.cl, @profesor.duoc.cl o @gmail.com).');
      return;
    }

    if (articulos.length === 0) {
      alert('Añade al menos un producto al pedido.');
      return;
    }

    const pedido = {
      id: `PED-${Date.now()}`,
      cliente,
      email,
      articulos,
      total: totalPedido,
      estado: 'Pendiente',
      creadoEn: new Date().toISOString(),
    };

    setPedidos(guardarPedido(pedido));
    setNuevoPedido({ cliente: '', email: '', codigoProducto: '', cantidad: '1' });
    setArticulos([]);
  };

  const cambiarEstado = (id, estado) => {
    setPedidos(actualizarEstadoPedido(id, estado));
  };

  return (
    <section className="container py-5 orders-page">
      <div className="mb-4">
        <p className="eyebrow mb-1">Gestión de ventas</p>
        <h1 className="orders-title">Pedidos</h1>
        <p className="text-muted mb-0">Crea pedidos para clientes y actualiza su estado durante la preparación.</p>
      </div>

      <div className="card orders-panel shadow-sm mb-4">
        <div className="card-header fw-bold">Crear pedido</div>
        <div className="card-body">
          <form onSubmit={crearPedido}>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="pedido-cliente">Nombre del cliente</label>
                <input id="pedido-cliente" className="form-control" name="cliente" value={nuevoPedido.cliente} onChange={manejarCambio} maxLength="100" required />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="pedido-email">Correo del cliente</label>
                <input id="pedido-email" className="form-control" type="email" name="email" value={nuevoPedido.email} onChange={manejarCambio} maxLength="100" required />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="pedido-producto">Producto</label>
                <select id="pedido-producto" className="form-select" name="codigoProducto" value={nuevoPedido.codigoProducto} onChange={manejarCambio}>
                  <option value="">Selecciona un producto</option>
                  {productos.map(producto => <option key={producto.codigo} value={producto.codigo}>{producto.nombre} — {formatoPrecio(producto.precio)}</option>)}
                </select>
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label" htmlFor="pedido-cantidad">Cantidad</label>
                <input id="pedido-cantidad" className="form-control" type="number" name="cantidad" value={nuevoPedido.cantidad} onChange={manejarCambio} min="1" step="1" required />
              </div>
              <div className="col-12 col-md-3 d-flex align-items-end">
                <button type="button" className="btn btn-outline-madera w-100" onClick={agregarArticulo}>Añadir producto</button>
              </div>
            </div>
            {articulos.length > 0 && (
              <div className="orders-draft mt-4">
                <h3 className="h6 fw-bold">Productos del pedido</h3>
                <ul className="list-group">
                  {articulos.map(articulo => (
                    <li key={articulo.codigo} className="list-group-item d-flex justify-content-between align-items-center gap-3">
                      <span>{articulo.nombre} × {articulo.cantidad}</span>
                      <span className="text-nowrap">{formatoPrecio(articulo.precio * articulo.cantidad)}</span>
                      <button type="button" className="btn btn-sm btn-outline-danger" aria-label={`Quitar ${articulo.nombre}`} onClick={() => setArticulos(actuales => actuales.filter(item => item.codigo !== articulo.codigo))}>Quitar</button>
                    </li>
                  ))}
                </ul>
                <p className="orders-total mt-3 mb-0" aria-live="polite">Total del pedido: {formatoPrecio(totalPedido)}</p>
              </div>
            )}
            <button type="submit" className="btn btn-madera mt-4">Registrar pedido</button>
          </form>
        </div>
      </div>

      <div className="card orders-panel shadow-sm">
        <div className="card-header fw-bold">Pedidos registrados</div>
        <div className="card-body">
          {pedidos.length === 0 ? (
            <p className="text-muted mb-0">Aún no hay pedidos registrados.</p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr><th>Pedido</th><th>Cliente</th><th>Productos</th><th>Total</th><th>Estado</th></tr>
                </thead>
                <tbody>
                  {pedidos.map(pedido => (
                    <tr key={pedido.id}>
                      <td><strong>{pedido.id}</strong><br /><small>{new Date(pedido.creadoEn).toLocaleDateString('es-CL')}</small></td>
                      <td>{pedido.cliente}<br /><small>{pedido.email}</small>{pedido.telefono && <><br /><small>{pedido.telefono}</small></>}</td>
                      <td>{(pedido.articulos || (pedido.producto ? [{ ...pedido.producto, cantidad: pedido.cantidad }] : [])).map(articulo => <div key={articulo.codigo}>{articulo.nombre} × {articulo.cantidad}</div>)}</td>
                      <td>{formatoPrecio(pedido.total)}</td>
                      <td>
                        <select className="form-select form-select-sm order-status" aria-label={`Estado del pedido ${pedido.id}`} value={pedido.estado} onChange={evento => cambiarEstado(pedido.id, evento.target.value)}>
                          {ESTADOS_PEDIDO.map(estado => <option key={estado} value={estado}>{estado}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
