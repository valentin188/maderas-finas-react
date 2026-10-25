import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProductoDetalle from '../../src/pages/ProductoDetalle';

describe('Componente ProductoDetalle', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('muestra los datos del producto indicado en la ruta', () => {
    render(
      <MemoryRouter initialEntries={['/productos/PR003']}>
        <Routes>
          <Route path="/productos/:codigo" element={<ProductoDetalle />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Escritorio ejecutivo' })).toBeTruthy();
    expect(screen.getByText('Madera de nogal')).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Escritorio ejecutivo' })).toBeTruthy();
  });

  it('muestra un aviso si el código no corresponde a un producto', () => {
    render(
      <MemoryRouter initialEntries={['/productos/PR999']}>
        <Routes>
          <Route path="/productos/:codigo" element={<ProductoDetalle />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('status').textContent).toContain('No encontramos ese producto');
    expect(screen.getByRole('link', { name: /volver al catálogo/i })).toBeTruthy();
  });
});
