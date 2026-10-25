import { obtenerOfertas } from '../../src/data/ofertas.js';

describe('Ofertas', () => {
  beforeEach(() => localStorage.clear());

  it('calcula precios y descuentos de los productos en oferta', () => {
    const ofertas = obtenerOfertas();
    expect(ofertas.length).toBe(3);
    expect(ofertas[0].precioOferta).toBe(225000);
  });
});
