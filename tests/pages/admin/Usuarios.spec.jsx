import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Usuarios from '../../../src/pages/admin/Usuarios';

describe('Usuarios de administración', () => {
  beforeEach(() => { localStorage.clear(); spyOn(window, 'alert'); });

  it('muestra la gestión y el administrador inicial', () => {
    render(<MemoryRouter><Usuarios /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /gestión de usuarios/i })).toBeTruthy();
    expect(screen.getByText('admin@duoc.cl')).toBeTruthy();
  });

  it('rechaza un RUN vacío', () => {
    render(<MemoryRouter><Usuarios /></MemoryRouter>);
    fireEvent.submit(document.querySelector('form'));
    expect(window.alert).toHaveBeenCalledWith('Ingresa un RUN válido, sin puntos ni guion.');
  });
});
