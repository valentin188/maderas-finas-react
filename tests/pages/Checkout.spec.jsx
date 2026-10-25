import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Checkout from '../../src/pages/Checkout';

const carrito = [{ codigo: 'PR001', cantidad: 1 }];
const montar = (setCarrito = () => {}) => render(
  <MemoryRouter initialEntries={['/checkout']}>
    <Routes>
      <Route path="/checkout" element={<Checkout carrito={carrito} setCarrito={setCarrito} />} />
      <Route path="/resultado-pago/:estado" element={<h1>Resultado guardado</h1>} />
    </Routes>
  </MemoryRouter>
);

describe('Checkout', () => {
  beforeEach(() => localStorage.clear());

  it('avisa cuando el carrito está vacío', () => {
    render(<MemoryRouter><Checkout carrito={[]} setCarrito={() => {}} /></MemoryRouter>);
    expect(screen.getByText('No tienes productos para confirmar')).toBeTruthy();
  });

  it('rechaza datos incompletos', () => {
    montar();
    fireEvent.submit(document.querySelector('form'));
    expect(screen.getByRole('alert').textContent).toContain('nombre válido');
  });

  it('guarda una compra válida y vacía el carrito', () => {
    const setCarrito = jasmine.createSpy('setCarrito');
    montar(setCarrito);
    const datos = { nombre: 'Ana', apellidos: 'Pérez', email: 'ana@gmail.com', direccion: 'Calle 123' };
    Object.entries(datos).forEach(([name, value]) => fireEvent.change(document.querySelector(`[name="${name}"]`), { target: { name, value } }));
    fireEvent.submit(document.querySelector('form'));
    expect(screen.getByText('Resultado guardado')).toBeTruthy();
    expect(JSON.parse(localStorage.getItem('resultado_ultima_compra')).estado).toBe('exitosa');
    expect(setCarrito).toHaveBeenCalledWith([]);
  });
});
