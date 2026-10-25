import { obtenerPedidos, guardarPedido, actualizarEstadoPedido } from '../../src/data/pedidos.js';

describe('Pedidos guardados', () => {
  beforeEach(() => localStorage.clear());

  it('guarda pedidos y actualiza su estado', () => {
    guardarPedido({ id: 'PED-1', estado: 'Pendiente' });
    expect(obtenerPedidos().length).toBe(1);
    expect(actualizarEstadoPedido('PED-1', 'Despachado')[0].estado).toBe('Despachado');
  });

  it('devuelve una lista vacía si el almacenamiento está dañado', () => {
    localStorage.setItem('pedidos', '{');
    expect(obtenerPedidos()).toEqual([]);
  });
});
