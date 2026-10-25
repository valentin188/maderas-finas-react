import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Inicio from '../../../src/pages/home/Inicio';

describe('Componente Home', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe mostrar el contenido de la página principal', () => {
    render(
      <MemoryRouter>
      <Inicio />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('link', { name: /ver catálogo completo/i })
    ).toBeTruthy();
  });

  it('debe mostrar productos destacados', () => {
    render(
      <MemoryRouter>
      <Inicio />
      </MemoryRouter>
    );

    expect(
      screen.getByText('Mesa de comedor 6 puestos')
    ).toBeTruthy();
  });

  it('debe mostrar los enlaces para ver el detalle de los productos', () => {
    render(
      <MemoryRouter>
      <Inicio />
      </MemoryRouter>
    );

    expect(
      screen.getAllByRole('link', { name: /ver detalle/i }).length
    ).toBe(3);
  });
});
