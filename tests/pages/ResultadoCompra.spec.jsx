import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ResultadoCompra from '../../src/pages/ResultadoCompra';

const montar = estado => render(
  <MemoryRouter initialEntries={[`/resultado-pago/${estado}`]}>
    <Routes><Route path="/resultado-pago/:estado" element={<ResultadoCompra />} /></Routes>
  </MemoryRouter>
);

describe('Resultado de compra', () => {
  beforeEach(() => localStorage.clear());

  it('pide volver a productos si no existe un resultado', () => {
    montar('exitosa');
    expect(screen.getByText('No hay un resultado de compra para mostrar')).toBeTruthy();
  });

  it('muestra el comprobante para una compra exitosa', () => {
    localStorage.setItem('resultado_ultima_compra', JSON.stringify({ estado: 'exitosa', numero: 'MF-1', articulos: [], total: 0 }));
    montar('exitosa');
    expect(screen.getByRole('button', { name: /descargar comprobante en pdf/i })).toBeTruthy();
  });
});
