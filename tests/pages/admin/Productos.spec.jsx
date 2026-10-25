import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductosAdmin from '../../../src/pages/admin/Productos';

const renderProductos = () => render(
  <MemoryRouter>
    <ProductosAdmin />
  </MemoryRouter>
);

describe('Gestión de productos', () => {
  beforeEach(() => {
    localStorage.clear();

    spyOn(window, 'alert');
    spyOn(window, 'confirm').and.returnValue(true);
  });

  afterEach(() => {
    localStorage.clear();
  });

  // 1. Renderizado del panel
  it('debe mostrar el panel de administración', () => {
    renderProductos();

    expect(screen.getByRole('heading', { name: /gestión de productos/i })).toBeTruthy();

    expect(
      screen.getByRole('button', { name: /agregar producto/i })
    ).toBeTruthy();
    expect(screen.getByText('PR001')).toBeTruthy();
  });

  // 2. Renderizado de los campos
  it('debe mostrar todos los campos del formulario', () => {
    renderProductos();

    expect(document.querySelector('input[name="codigo"]')).not.toBeNull();
    expect(document.querySelector('input[name="nombre"]')).not.toBeNull();
    expect(document.querySelector('select[name="categoria"]')).not.toBeNull();
    expect(document.querySelector('input[name="material"]')).not.toBeNull();
    expect(document.querySelector('input[name="tiempo"]')).not.toBeNull();
    expect(document.querySelector('input[name="precio"]')).not.toBeNull();
    expect(document.querySelector('input[name="stock"]')).not.toBeNull();
    expect(document.querySelector('input[name="stockCritico"]')).not.toBeNull();
    expect(document.querySelector('input[name="imagen"]')).not.toBeNull();
  });

  // 3. Carga de productos
  it('debe mostrar los productos registrados', () => {
    renderProductos();

    expect(screen.getByText('Mesa de comedor 6 puestos')).toBeTruthy();
    expect(screen.getByText('PR001')).toBeTruthy();
  });

  // 4. Cambio de estado de los campos
  it('debe actualizar el estado al escribir en el formulario', () => {
    renderProductos();

    const campoNombre = document.querySelector('input[name="nombre"]');
    const campoPrecio = document.querySelector('input[name="precio"]');

    fireEvent.change(campoNombre, {
      target: { name: 'nombre', value: 'Mesa de prueba' }
    });

    fireEvent.change(campoPrecio, {
      target: { name: 'precio', value: '150000' }
    });

    expect(campoNombre.value).toBe('Mesa de prueba');
    expect(campoPrecio.value).toBe('150000');
  });

  // 5. Crear un producto
  it('debe agregar un producto nuevo', () => {
    renderProductos();

    fireEvent.change(document.querySelector('input[name="codigo"]'), {
      target: { name: 'codigo', value: 'pr007' }
    });

    fireEvent.change(document.querySelector('input[name="nombre"]'), {
      target: { name: 'nombre', value: 'Mesa auxiliar' }
    });

    fireEvent.change(document.querySelector('select[name="categoria"]'), {
      target: { name: 'categoria', value: 'Muebles' }
    });

    fireEvent.change(document.querySelector('input[name="material"]'), {
      target: { name: 'material', value: 'Pino' }
    });

    fireEvent.change(document.querySelector('input[name="tiempo"]'), {
      target: { name: 'tiempo', value: '4' }
    });

    fireEvent.change(document.querySelector('input[name="precio"]'), {
      target: { name: 'precio', value: '90000' }
    });

    fireEvent.change(document.querySelector('input[name="stock"]'), {
      target: { name: 'stock', value: '12' }
    });

    fireEvent.change(document.querySelector('input[name="stockCritico"]'), {
      target: { name: 'stockCritico', value: '3' }
    });

    fireEvent.change(document.querySelector('input[name="imagen"]'), {
      target: { name: 'imagen', value: 'mesa-auxiliar.jpg' }
    });

    fireEvent.submit(document.querySelector('form'));

    expect(screen.getByText('PR007')).toBeTruthy();
    expect(screen.getByText('Mesa auxiliar')).toBeTruthy();
    expect(window.alert).toHaveBeenCalledWith(
      'Producto agregado correctamente.'
    );
  });

  // 6. Validación de código duplicado
  it('debe impedir agregar un producto con un código existente', () => {
    renderProductos();

    fireEvent.change(document.querySelector('input[name="codigo"]'), {
      target: { name: 'codigo', value: 'PR001' }
    });

    fireEvent.change(document.querySelector('input[name="nombre"]'), {
      target: { name: 'nombre', value: 'Producto duplicado' }
    });

    fireEvent.change(document.querySelector('input[name="material"]'), {
      target: { name: 'material', value: 'Pino' }
    });

    fireEvent.change(document.querySelector('input[name="imagen"]'), {
      target: { name: 'imagen', value: 'duplicado.jpg' }
    });

    fireEvent.submit(document.querySelector('form'));

    expect(window.alert).toHaveBeenCalledWith(
      'Ya existe un producto con ese código.'
    );

    expect(screen.queryByText('Producto duplicado')).toBeNull();
  });

  // 7. Editar un producto
  it('debe cargar los datos de un producto al pulsar Editar', () => {
    renderProductos();

    const fila = screen.getByText('PR001').closest('tr');

    fireEvent.click(
      within(fila).getByRole('button', { name: /editar/i })
    );

    expect(screen.getByText(/editar producto/i)).toBeTruthy();
    expect(document.querySelector('input[name="codigo"]').disabled).toBe(true);
    expect(document.querySelector('input[name="nombre"]').value).toBe(
      'Mesa de comedor 6 puestos'
    );

    expect(
      screen.getByRole('button', { name: /guardar cambios/i })
    ).toBeTruthy();

    expect(
      screen.getByRole('button', { name: /cancelar/i })
    ).toBeTruthy();
  });

  // 8. Guardar cambios de un producto
  it('debe actualizar un producto existente', () => {
    renderProductos();

    const fila = screen.getByText('PR001').closest('tr');

    fireEvent.click(
      within(fila).getByRole('button', { name: /editar/i })
    );

    fireEvent.change(document.querySelector('input[name="precio"]'), {
      target: { name: 'precio', value: '260000' }
    });

    fireEvent.click(
      screen.getByRole('button', { name: /guardar cambios/i })
    );

    expect(window.alert).toHaveBeenCalledWith(
      'Producto actualizado correctamente.'
    );

    expect(screen.getByText('$260.000')).toBeTruthy();
    expect(
      screen.getByRole('button', { name: /agregar producto/i })
    ).toBeTruthy();
  });

  // 9. Cancelar la edición
  it('debe cancelar la edición y limpiar el formulario', () => {
    renderProductos();

    const fila = screen.getByText('PR001').closest('tr');

    fireEvent.click(
      within(fila).getByRole('button', { name: /editar/i })
    );

    fireEvent.click(
      screen.getByRole('button', { name: /cancelar/i })
    );

    expect(
      screen.getByRole('button', { name: /agregar producto/i })
    ).toBeTruthy();
    expect(document.querySelector('input[name="codigo"]').value).toBe('');
    expect(document.querySelector('input[name="nombre"]').value).toBe('');
    expect(
      screen.queryByRole('button', { name: /cancelar/i })
    ).toBeNull();
  });

  // 10. Eliminar un producto
  it('debe eliminar un producto cuando se confirma la acción', () => {
    renderProductos();

    const fila = screen.getByText('PR001').closest('tr');

    fireEvent.click(
      within(fila).getByRole('button', { name: /eliminar/i })
    );

    expect(window.confirm).toHaveBeenCalledWith(
      '¿Deseas eliminar el producto PR001?'
    );

    expect(screen.queryByText('PR001')).toBeNull();
    expect(screen.queryByText('Mesa de comedor 6 puestos')).toBeNull();
  });

  // 11. Cancelar la eliminación
  it('no debe eliminar un producto si se cancela la confirmación', () => {
    window.confirm.and.returnValue(false);

    renderProductos();

    const fila = screen.getByText('PR001').closest('tr');

    fireEvent.click(
      within(fila).getByRole('button', { name: /eliminar/i })
    );

    expect(screen.getByText('PR001')).toBeTruthy();
    expect(screen.getByText('Mesa de comedor 6 puestos')).toBeTruthy();
  });
});
