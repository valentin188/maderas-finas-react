import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../../src/components/Navbar';

describe('Componente Navbar', () => {
  it('debe mostrar el nombre de la tienda', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/Maderas Finas/i)).toBeTruthy();
  });

  it('debe mostrar el enlace a productos', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('link', { name: /productos/i })
    ).toBeTruthy();
  });

  it('debe mostrar la cantidad de productos en el carrito', () => {
    render(
      <MemoryRouter>
        <Navbar cantidadCarrito={3} />
      </MemoryRouter>
    );

    expect(screen.getByText('3')).toBeTruthy();
  });

  it('debe mostrar los enlaces de navegación', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('link', { name: /^home$/i })
    ).toBeTruthy();

    expect(
      screen.getByRole('link', { name: /productos/i })
    ).toBeTruthy();
  });

  it('muestra solo enlaces internos y retorno a tienda para administración', () => {
    render(
      <MemoryRouter>
        <Navbar usuarioActual={{ tipo: 'Admin' }} cantidadCarrito={2} />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /administración/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /volver a la tienda/i })).toBeTruthy();
    expect(screen.queryByRole('link', { name: /productos/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /categorías/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /ofertas/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /carrito/i })).toBeNull();
  });

  it('muestra solo pedidos y retorno a tienda para vendedores', () => {
    render(
      <MemoryRouter>
        <Navbar usuarioActual={{ tipo: 'Vendedor' }} />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /^pedidos$/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /volver a la tienda/i })).toBeTruthy();
    expect(screen.queryByRole('link', { name: /productos/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /categorías/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /ofertas/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /carrito/i })).toBeNull();
  });
});
