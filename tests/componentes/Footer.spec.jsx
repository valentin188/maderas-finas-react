import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from '../../src/components/Footer';

const renderizarFooter = () => render(<MemoryRouter><Footer /></MemoryRouter>);

describe('Componente Footer', () => {
  it('debe renderizar el pie de página', () => {
    const { container } = renderizarFooter();

    expect(container.querySelector('footer')).not.toBeNull();
  });

  it('debe mostrar el nombre de la empresa', () => {
    const { container } = renderizarFooter();

    expect(container.textContent).toMatch(/Maderas Finas/i);
  });

  it('debe mostrar el año actual o el año indicado en el componente', () => {
    const { container } = renderizarFooter();

    expect(container.textContent).toMatch(/\d{4}/);
  });

  it('oculta los enlaces del pie de página al personal interno', () => {
    const { container } = render(
      <MemoryRouter>
        <Footer usuarioActual={{ tipo: 'Admin' }} />
      </MemoryRouter>
    );

    expect(container.textContent).toContain('© 2026 Maderas Finas');
    expect(container.querySelector('.footer-links')).toBeNull();
  });
});
