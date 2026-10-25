import { obtenerProductos } from './mockData.js';

// Descuentos de demostración para la vista de ofertas.
const descuentosDemo = {
  PR001: 10,
  PR005: 15,
  PR006: 12,
};

export const obtenerOfertas = () => {
  const productos = obtenerProductos();

  return Object.entries(descuentosDemo).flatMap(([codigo, descuento]) => {
    const producto = productos.find(item => item.codigo === codigo);
    if (!producto) return [];

    return [{
      ...producto,
      descuento,
      precioAnterior: producto.precio,
      precioOferta: Math.round(producto.precio * (1 - descuento / 100)),
    }];
  });
};
