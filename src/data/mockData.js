// Maderas Finas · datos para la demostración académica; no hay servidor ni pagos reales.
const productosIniciales = [
  {
    codigo: 'PROD001',
    nombre: 'Mesa de comedor 6 puestos',
    categoria: 'Muebles',
    material: 'Madera de roble',
    precio: 250000,
    stock: 10,
    imagen: ''
  },
  {
    codigo: "PR002",
    nombre: "Silla de comedor",
    categoria: "Muebles",
    material: "Madera de pino",
    tiempo: 3,
    precio: 65000,
    stock: 120,
    stockCritico: 10,
    imagen: "silla-comedor.jpg"
  },
  {
    codigo: "PR003",
    nombre: "Escritorio ejecutivo",
    categoria: "Oficina",
    material: "Madera de nogal",
    tiempo: 10,
    precio: 380000,
    stock: 15,
    stockCritico: 3,
    imagen: "escritorio-ejecutivo.jpg"
  },
  {
    codigo: "PR004",
    nombre: "Estantería de oficina",
    categoria: "Oficina",
    material: "Madera de pino",
    tiempo: 6,
    precio: 180000,
    stock: 30,
    stockCritico: 5,
    imagen: "estanteria-oficina.jpg"
  },
    {
    codigo: "PR005",
    nombre: "Ropero con espejo",
    categoria: "Muebles",
    material: "Madera de roble",
    tiempo: 12,
    precio: 420000,
    stock: 10,
    stockCritico: 5,
    imagen: "ropero-espejo.jpg"
  },
  {
    codigo: "PR006",
    nombre: "Mesón de cocina",
    categoria: "Muebles",
    material: "Madera de nogal",
    tiempo: 14,
    precio: 520000,
    stock: 8,
    stockCritico: 3,
    imagen: "encimera-cocina.jpg"
  }
];


function leerJSON(clave, fallback) {
  try {
    const dato = localStorage.getItem(clave);
    return dato === null ? fallback : JSON.parse(dato);
  } catch { return fallback; }
}
function escribirJSON(clave, dato) {
  try { localStorage.setItem(clave, JSON.stringify(dato)); return true; }
  catch { return false; }
}

export const inicializarStorage = () => {
  // Mantener productos antiguos sin sobrescribir stock, precios ni nuevos registros.
  const guardados = leerJSON('productos', []);
  const actuales = Array.isArray(guardados) ? [...guardados] : [];
  for (const inicial of productosIniciales) {
    if (!actuales.some((p) => p.codigo === inicial.codigo)) actuales.push(inicial);
  }
  escribirJSON('productos', actuales);
  if (leerJSON('usuarios', null) === null) {
    escribirJSON('usuarios', [{
      run: '11111111K', nombre: 'Administrador', apellidos: 'Sistema',
      email: 'admin@duoc.cl', password: 'Admin123', tipo: 'Admin',
    }]);
  }
};

export const obtenerProductos = () => {
  inicializarStorage();
  const productos = leerJSON('productos', []);
  return Array.isArray(productos) ? productos : [];
};
export const obtenerProductoPorCodigo = (codigo) => obtenerProductos().find((p) => p.codigo === codigo) || null;
export const guardarProducto = (producto) => {
  const productos = obtenerProductos();
  const i = productos.findIndex((p) => p.codigo === producto.codigo);
  if (i === -1) productos.push(producto); else productos[i] = producto;
  escribirJSON('productos', productos);
  return productos;
};
export const eliminarProducto = (codigo) => {
  const productos = obtenerProductos().filter((p) => p.codigo !== codigo);
  escribirJSON('productos', productos);
  return productos;
};

// Se leen los precios y el stock del catálogo y nunca del carrito almacenado.
export const obtenerCarrito = () => {
  const almacenado = leerJSON('carrito', []);
  if (!Array.isArray(almacenado)) return [];
  const productos = new Map(obtenerProductos().map((p) => [p.codigo, p]));
  const acumulado = new Map();
  for (const item of almacenado) {
    const producto = item && productos.get(item.codigo);
    if (!producto) continue;
    const stock = Math.max(0, Math.trunc(Number(producto.stock) || 0));
    const cantidad = Math.max(0, Math.trunc(Number(item.cantidad) || 0));
    if (!stock || !cantidad) continue;
    acumulado.set(item.codigo, {
      ...producto,
      cantidad: Math.min(stock, (acumulado.get(item.codigo)?.cantidad || 0) + cantidad),
    });
  }
  return [...acumulado.values()];
};
export const guardarCarrito = (carrito) => escribirJSON('carrito', carrito.map(({ codigo, cantidad }) => ({ codigo, cantidad })));
export const guardarPedidoDemo = (pedido) => {
  const guardados = leerJSON('pedidos_demo', []);
  return escribirJSON('pedidos_demo', [...(Array.isArray(guardados) ? guardados : []), pedido]);
};
