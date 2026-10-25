import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Carrito from '../../src/pages/Carrito';

describe('Carrito', () => {
  beforeEach(() => localStorage.clear());

  it('muestra un enlace a productos cuando está vacío', () => {
    render(<MemoryRouter><Carrito carrito={[]} setCarrito={() => {}} /></MemoryRouter>);
    expect(screen.getByText('Tu carrito está vacío')).toBeTruthy();
  });

  it('actualiza cantidades y permite vaciarlo', () => {
    const item = { codigo: 'PR001', nombre: 'Mesa de comedor 6 puestos', material: 'Roble', precio: 250000, cantidad: 1 };
    const setCarrito = jasmine.createSpy('setCarrito');
    render(<MemoryRouter><Carrito carrito={[item]} setCarrito={setCarrito} /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: /aumentar cantidad/i }));
    expect(setCarrito).toHaveBeenCalledWith([{ ...item, cantidad: 2 }]);
    fireEvent.click(screen.getByRole('button', { name: /vaciar carrito/i }));
    expect(setCarrito).toHaveBeenCalledWith([]);
  });
});
