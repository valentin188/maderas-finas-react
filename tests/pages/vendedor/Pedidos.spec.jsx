import { fireEvent, render, screen } from '@testing-library/react';
import Pedidos from '../../../src/pages/vendedor/Pedidos';

describe('Pedidos del vendedor', () => {
  beforeEach(() => { localStorage.clear(); spyOn(window, 'alert'); });

  it('muestra el formulario y avisa si no se elige producto', () => {
    render(<Pedidos />);
    expect(screen.getByRole('heading', { name: 'Pedidos' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /añadir producto/i }));
    expect(window.alert).toHaveBeenCalled();
  });
});
