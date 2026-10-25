// src/data/mockData.js
const productosIniciales = [
  {
    codigo: "PR001",
    nombre: "Mesa de comedor 6 puestos",
    categoria: "Muebles",
    material: "Madera de roble",
    tiempo: 8,
    precio: 250000,
    stock: 25,
    stockCritico: 5,
    imagen: "mesa-comedor.jpg"
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
    const valor = localStorage.getItem(clave);
    return valor === null ? fallback : JSON.parse(valor);
  } catch {
    return fallback;
  }
}

function escribirJSON(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

export const inicializarStorage = () => {
  const guardados = leerJSON("productos", []);
  const productosActualizados = Array.isArray(guardados) ? [...guardados] : [];

  productosIniciales.forEach((productoInicial) => {
    const existe = productosActualizados.some(
      producto => producto.codigo === productoInicial.codigo
    );
    if (!existe) {
      productosActualizados.push(productoInicial);
    }
  });

  escribirJSON("productos", productosActualizados);
  let usuarios = [];
  try {
    usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    if (!Array.isArray(usuarios)) usuarios = [];
  } catch {
    usuarios = [];
  }

  // Retira únicamente la cuenta Vendedor de demostración que esta aplicación
  // sembraba anteriormente, para que las cuentas vendedor se creen desde Admin.
  usuarios = usuarios.filter(usuario => !(
    String(usuario.email || "").toLowerCase() === "vendedor@duoc.cl" &&
    usuario.nombre === "Vendedor" &&
    usuario.apellidos === "Sistema" &&
    usuario.password === "Vendedor123" &&
    usuario.tipo === "Vendedor" &&
    !usuario.run
  ));

  const cuentasIniciales = [
    {
      nombre: "Administrador",
      apellidos: "Sistema",
      email: "admin@duoc.cl",
      password: "Admin123",
      tipo: "Admin"
    }
  ];

  cuentasIniciales.forEach(cuentaInicial => {
    const existe = usuarios.some(usuario =>
      String(usuario.email || "").toLowerCase() === cuentaInicial.email
    );
    if (!existe) usuarios.push(cuentaInicial);
  });

  localStorage.setItem("usuarios", JSON.stringify(usuarios));
};

export const obtenerProductos = () => {
  inicializarStorage();
  const productos = leerJSON("productos", []);
  return Array.isArray(productos) ? productos : [];
};

export const obtenerUsuarios = () => {
  inicializarStorage();
  try {
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    return Array.isArray(usuarios) ? usuarios : [];
  } catch {
    return [];
  }
};

export const guardarUsuarios = (usuarios) => {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  return usuarios;
};

export const obtenerProductoPorCodigo = (codigo) => {
  const productos = obtenerProductos();
  return productos.find(p => p.codigo === codigo) || null;
};

export const guardarProducto = (producto) => {
  const productos = obtenerProductos();
  const index = productos.findIndex(p => p.codigo === producto.codigo);

  if (index !== -1) {
    productos[index] = producto;
  } else {
    productos.push(producto);
  }

  localStorage.setItem("productos", JSON.stringify(productos));
  return productos;
};

export const eliminarProducto = (codigo) => {
  const productos = obtenerProductos().filter(p => p.codigo !== codigo);
  localStorage.setItem("productos", JSON.stringify(productos));
  return productos;
};

// El carrito guarda códigos y cantidades; los precios y el stock siempre se leen del catálogo.
export const obtenerCarrito = () => {
  const almacenado = leerJSON("carrito", []);
  if (!Array.isArray(almacenado)) return [];

  const productos = new Map(obtenerProductos().map(producto => [producto.codigo, producto]));
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

export const guardarCarrito = (carrito) => escribirJSON(
  "carrito",
  (Array.isArray(carrito) ? carrito : []).map(({ codigo, cantidad }) => ({ codigo, cantidad }))
);

export const guardarPedidoDemo = (pedido) => {
  const guardados = leerJSON("pedidos_demo", []);
  return escribirJSON("pedidos_demo", [...(Array.isArray(guardados) ? guardados : []), pedido]);
};
