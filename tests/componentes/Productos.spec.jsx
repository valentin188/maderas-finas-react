import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Productos from '../../src/pages/Productos';

describe('Componente Productos', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe mostrar los productos disponibles', () => {
    render(
      <MemoryRouter>
        <Productos setCarrito={() => {}} />
      </MemoryRouter>
    );

    expect(
        screen.getByText('Mesa de comedor 6 puestos')
    ).toBeTruthy();
  });

  it('debe permitir buscar productos por nombre', () => {
    render(
      <MemoryRouter>
        <Productos setCarrito={() => {}} />
      </MemoryRouter>
    );

    const campoBusqueda = screen.getByPlaceholderText(/buscar/i);

    fireEvent.change(campoBusqueda, {
      target: { value: 'Escritorio' }
    });

    expect(screen.getByText(/Escritorio/i)).toBeTruthy();
  });

  it('debe permitir buscar productos por nombre', () => {
    render(
        <MemoryRouter>
        <Productos />
        </MemoryRouter>
    );
    const buscador = screen.getByPlaceholderText(
        /buscar por nombre o categoría/i
    );
    expect(buscador).toBeTruthy();
    expect(buscador.value).toBe('');
  });
});