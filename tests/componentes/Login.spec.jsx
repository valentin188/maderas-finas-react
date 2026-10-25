import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../src/pages/Login';

describe('Componente Login', () => {
  it('debe mostrar el formulario de inicio de sesión', () => {
    render(
      <MemoryRouter>
        <Login usuarioActual={null} setUsuarioActual={() => {}} />
      </MemoryRouter>
    );

    expect(
        screen.getByText('Iniciar Sesión', { selector: 'div.card-header' })
    ).toBeTruthy();
  });

  it('debe mostrar el campo de correo electrónico', () => {
    render(
      <MemoryRouter>
        <Login usuarioActual={null} setUsuarioActual={() => {}} />
      </MemoryRouter>
    );

    expect(
      document.querySelector('input[type="email"]')
    ).toBeTruthy();
  });

  it('debe mostrar el campo de contraseña', () => {
    render(
      <MemoryRouter>
        <Login usuarioActual={null} setUsuarioActual={() => {}} />
      </MemoryRouter>
    );

    expect(
      document.querySelector('input[type="password"]')
    ).toBeTruthy();
  });

  it('debe permitir escribir en el campo de correo electrónico', () => {
    render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
    );
    const email = document.querySelector('input[type="email"]');
    expect(email).not.toBeNull();
    email.value = 'prueba@correo.cl';
    expect(email.value).toBe('prueba@correo.cl');
  });
});
