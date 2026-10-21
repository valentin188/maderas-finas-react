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
  }
];

export const inicializarStorage = () => {
  if (!localStorage.getItem("productos")) {
    localStorage.setItem("productos", JSON.stringify(productosIniciales));
  }
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