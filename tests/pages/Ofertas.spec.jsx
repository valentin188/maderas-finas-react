import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Ofertas from '../../src/pages/Ofertas';

describe('Página de ofertas', () => {
  it('muestra promociones y enlaces al detalle', () => {
    localStorage.clear();
    render(<MemoryRouter><Ofertas /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Ofertas para tu hogar' })).toBeTruthy();
    expect(screen.getAllByRole('link', { name: 'Ver detalle' }).length).toBe(3);
  });
});
