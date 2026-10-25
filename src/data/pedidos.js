const CLAVE_PEDIDOS = 'pedidos';

export const obtenerPedidos = () => {
  try {
    const pedidos = JSON.parse(localStorage.getItem(CLAVE_PEDIDOS) || '[]');
    return Array.isArray(pedidos) ? pedidos : [];
  } catch {
    return [];
  }
};

export const guardarPedido = (pedido) => {
  const pedidos = [pedido, ...obtenerPedidos()];
  localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(pedidos));
  return pedidos;
};

export const actualizarEstadoPedido = (id, estado) => {
  const pedidos = obtenerPedidos().map(pedido =>
    pedido.id === id ? { ...pedido, estado } : pedido
  );
  localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(pedidos));
  return pedidos;
};
