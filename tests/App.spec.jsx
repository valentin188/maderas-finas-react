import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RutasApp } from '../src/App';

const renderizarRutas = (ruta, usuarioActual = null) => render(
  <MemoryRouter initialEntries={[ruta]}>
    <RutasApp
      usuarioActual={usuarioActual}
      iniciarSesion={() => {}}
      carrito={[]}
      setCarrito={() => {}}
    />
  </MemoryRouter>
);

describe('Rutas protegidas de la aplicación', () => {
  it('redirige al inicio de sesión si se visita una ruta privada sin sesión', () => {
    renderizarRutas('/admin');
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeTruthy();
  });

  it('permite el acceso al panel solo a administradores', () => {
    renderizarRutas('/admin', { tipo: 'Admin' });
    expect(screen.getByRole('heading', { name: /panel de administración/i })).toBeTruthy();
  });

  it('redirige a clientes fuera de la administración', () => {
    renderizarRutas('/admin', { tipo: 'Cliente' });
    expect(screen.getByRole('link', { name: /ver catálogo completo/i })).toBeTruthy();
  });

  it('redirige a vendedores fuera de la administración', () => {
    renderizarRutas('/admin', { tipo: 'Vendedor' });
    expect(screen.getByRole('heading', { level: 1, name: 'Maderas Finas' })).toBeTruthy();
    expect(screen.queryByRole('link', { name: /ver catálogo completo/i })).toBeNull();
  });

  it('permite los pedidos solo a vendedores', () => {
    renderizarRutas('/pedidos', { tipo: 'Vendedor' });
    expect(screen.getByRole('heading', { name: /^pedidos$/i })).toBeTruthy();
  });

  it('redirige a clientes fuera de los pedidos', () => {
    renderizarRutas('/pedidos', { tipo: 'Cliente' });
    expect(screen.getByRole('link', { name: /ver catálogo completo/i })).toBeTruthy();
  });

  it('redirige al panel interno al visitar una ruta de tienda como administrador', () => {
    for (const ruta of ['/productos', '/categorias', '/ofertas', '/carrito', '/checkout']) {
      const vista = renderizarRutas(ruta, { tipo: 'Admin' });
      expect(screen.getByRole('heading', { name: /panel de administración/i })).toBeTruthy();
      vista.unmount();
    }
  });

  it('redirige a pedidos al visitar una ruta de tienda como vendedor', () => {
    for (const ruta of ['/productos', '/categorias', '/ofertas', '/carrito', '/checkout']) {
      const vista = renderizarRutas(ruta, { tipo: 'Vendedor' });
      expect(screen.getByRole('heading', { name: /^pedidos$/i })).toBeTruthy();
      vista.unmount();
    }
  });

  it('redirige al inicio de sesión si un usuario sin sesión visita pedidos', () => {
    renderizarRutas('/pedidos');
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeTruthy();
  });
});
