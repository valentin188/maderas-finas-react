import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Categorias from '../../src/pages/Categorias';

describe('Componente Categorias', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe mostrar el título de la página', () => {
    render(<MemoryRouter><Categorias /></MemoryRouter>);

    expect(
      screen.getByRole('heading', { name: /categorías/i })
    ).toBeTruthy();
  });

  it('debe mostrar la categoría Muebles', () => {
    render(<MemoryRouter><Categorias /></MemoryRouter>);

    expect(
      screen.getByText('Muebles')
    ).toBeTruthy();
  });

  it('debe mostrar la categoría Oficina', () => {
    render(<MemoryRouter><Categorias /></MemoryRouter>);

    expect(
      screen.getByText('Oficina')
    ).toBeTruthy();
  });

  it('debe mostrar las categorías disponibles', () => {
    const { container } = render(
        <MemoryRouter>
        <Categorias />
        </MemoryRouter>
    );
    expect(container.querySelector('h1, h2, h3')).not.toBeNull();
  });
});
