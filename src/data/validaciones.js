const DOMINIOS_PERMITIDOS = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com'];

export const correoValido = (correo) => {
  const normalizado = correo.trim().toLowerCase();
  const partes = normalizado.split('@');
  return /^[^\s@]+@[^\s@]+$/.test(normalizado) &&
    partes.length === 2 &&
    DOMINIOS_PERMITIDOS.includes(partes[1]);
};

export const telefonoValido = (telefono) => {
  const normalizado = String(telefono || '').replace(/[\s().-]/g, '');
  return /^(?:\+?56)?9\d{8}$/.test(normalizado);
};

export const runValido = (runIngresado) => {
  const run = runIngresado.trim().toUpperCase();
  if (run.includes('.') || run.includes('-') || run.length < 7 || run.length > 9) {
    return false;
  }

  if (!/^[0-9]+[0-9K]$/.test(run)) {
    return false;
  }

  const cuerpo = run.slice(0, -1);
  const digito = run.slice(-1);
  let suma = 0;
  let multiplicador = 2;

  for (let index = cuerpo.length - 1; index >= 0; index -= 1) {
    suma += Number(cuerpo[index]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resultado = 11 - (suma % 11);
  const esperado = resultado === 11 ? '0' : resultado === 10 ? 'K' : String(resultado);
  return digito === esperado;
};
