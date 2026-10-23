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

export const inicializarStorage = () => {
  const productosGuardados = JSON.parse(localStorage.getItem("productos") || "[]");
  const productosActualizados = [...productosGuardados];

  productosIniciales.forEach((productoInicial) => {
    const existe = productosActualizados.some(
      producto => producto.codigo === productoInicial.codigo
    );
    if (!existe) {
      productosActualizados.push(productoInicial);
    }
  });

  localStorage.setItem("productos", JSON.stringify(productosActualizados));
  if (!localStorage.getItem("usuarios")) {
    
    localStorage.setItem("usuarios", JSON.stringify([
      {
        run: "11111111K",
        nombre: "Administrador",
        apellidos: "Sistema",
        email: "admin@duoc.cl",
        password: "Admin123",
        tipo: "Admin"
      }
    ]));
  }
};

export const obtenerProductos = () => {
  inicializarStorage();
  return JSON.parse(localStorage.getItem("productos")) || [];
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

export const obtenerCarrito = () => {
  return JSON.parse(localStorage.getItem("carrito")) || [];
};

export const guardarCarrito = (carrito) => {
  localStorage.setItem("carrito", JSON.stringify(carrito));
};