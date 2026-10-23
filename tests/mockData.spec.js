
import {
  obtenerProductos,
  obtenerProductoPorCodigo,
  guardarProducto,
  eliminarProducto
} from '../src/data/mockData';

describe('Gestión de productos', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe cargar los seis productos iniciales', () => {
    const productos = obtenerProductos();

    expect(productos.length).toBe(6);
  });

  it('debe encontrar un producto por su código', () => {
    const producto = obtenerProductoPorCodigo('PR001');

    expect(producto).not.toBeNull();
    expect(producto.nombre).toBe('Mesa de comedor 6 puestos');
  });

  it('debe devolver null cuando el producto no existe', () => {
    const producto = obtenerProductoPorCodigo('PR999');

    expect(producto).toBeNull();
  });

  it('debe crear un producto nuevo', () => {
    const nuevoProducto = {
      codigo: 'PR007',
      nombre: 'Mesa auxiliar',
      categoria: 'Muebles',
      material: 'Madera de pino',
      tiempo: 4,
      precio: 90000,
      stock: 12,
      stockCritico: 3,
      imagen: 'mesa-auxiliar.jpg'
    };

    guardarProducto(nuevoProducto);

    expect(obtenerProductoPorCodigo('PR007').nombre)
      .toBe('Mesa auxiliar');
  });

  it('debe actualizar un producto existente', () => {
    const producto = obtenerProductoPorCodigo('PR001');

    guardarProducto({
      ...producto,
      precio: 260000
    });

    expect(obtenerProductoPorCodigo('PR001').precio).toBe(260000);
  });

  it('debe eliminar un producto', () => {
    const nuevoProducto = {
      codigo: 'PR007',
      nombre: 'Mesa auxiliar',
      categoria: 'Muebles',
      material: 'Madera de pino',
      tiempo: 4,
      precio: 90000,
      stock: 12,
      stockCritico: 3,
      imagen: 'mesa-auxiliar.jpg'
    };

    guardarProducto(nuevoProducto);
    eliminarProducto('PR007');

    expect(obtenerProductoPorCodigo('PR007')).toBeNull();
  });
});
