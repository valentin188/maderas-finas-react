import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Registro from '../../src/pages/Registro';

describe('Componente Registro', () => {
  it('debe mostrar el formulario de registro', () => {
    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>
    );

    expect(
      screen.getByText('Registro de Usuario')
    ).toBeTruthy();
  });

  it('debe mostrar el campo de correo electrónico', () => {
    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>
    );
    expect(
      document.querySelector('input[name="email"]')
    ).toBeTruthy();
  });

  it('debe mostrar el botón para registrar al usuario', () => {
    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('button', { name: /registrar/i })
    ).toBeTruthy();
  });

  it('debe permitir escribir en el campo de correo electrónico', () => {
    render(
        <MemoryRouter>
        <Registro />
        </MemoryRouter>
    );
    const email = document.querySelector('input[name="email"]');
    email.value = 'prueba@correo.cl';
    email.dispatchEvent(new Event('input', { bubbles: true }));
    expect(email.value).toBe('prueba@correo.cl');
  });
});