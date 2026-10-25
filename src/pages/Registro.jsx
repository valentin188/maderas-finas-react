
import { useState } from 'react';
import { inicializarStorage } from '../data/mockData';

const datosIniciales = {
  run: '',
  nombre: '',
  apellidos: '',
  email: '',
  password: '',
  tipo: 'Cliente'
};

// Correos de ejemplo que no aceptaremos
const correosEjemplo = new Set([
  'nombre.apellido@gmail.com',
  'ejemplo@gmail.com',
  'usuario@gmail.com',
  'tu@correo.cl',
  'test@test.com',
  'prueba@prueba.com',
  'correo@correo.com'
]);

// Normalizar RUN
const normalizarRun = (valor) =>
  valor.replace(/[.\s]/g, '').toUpperCase();

// Validar el correo
function validarCorreo(valor) {
  const correo = valor.trim().toLowerCase();

  if (!correo) {
    return 'El correo electrónico es obligatorio.';
  }

  if (correosEjemplo.has(correo)) {
    return 'No se permiten correos de ejemplo. Ingresa tu correo personal.';
  }

  if (
    correo.length > 254 ||
    correo.includes('..') ||
    /\s/.test(correo)
  ) {
    return 'El correo electrónico tiene un formato incorrecto.';
  }

  const partes = correo.split('@');

  if (partes.length !== 2) {
    return 'El correo debe contener una sola arroba (@).';
  }

  const [usuario, dominio] = partes;

  const formatoUsuario =
    /^[a-z0-9_%+-]+(?:\.[a-z0-9_%+-]+)*$/i;

  if (
    !usuario ||
    usuario.length > 64 ||
    !formatoUsuario.test(usuario)
  ) {
    return 'La parte anterior a @ no es válida.';
  }

  const etiquetas = dominio.split('.');

  if (etiquetas.length < 2) {
    return 'El dominio debe tener una extensión, como .cl o .com.';
  }

  const formatoDominio =
    /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

  const dominioIncorrecto = etiquetas.some(
    (etiqueta) =>
      etiqueta.length > 63 ||
      !formatoDominio.test(etiqueta)
  );

  if (dominioIncorrecto) {
    return 'El dominio del correo no es válido.';
  }

  const extension = etiquetas[etiquetas.length - 1];

  if (!/^[a-z]{2,}$/i.test(extension)) {
    return 'La extensión del correo debe tener al menos dos letras.';
  }

  return '';
}

// Validar todos los campos
function validarFormulario(datos) {
  const errores = {};

  const run = normalizarRun(datos.run);

  if (!datos.run.trim()) {
    errores.run = 'El RUN es obligatorio.';
  } else if (!/^\d{7,8}-[\dK]$/.test(run)) {
    errores.run = 'Ingresa el RUN con formato 12.345.678-9.';
  }

  if (!datos.nombre.trim()) {
    errores.nombre = 'El nombre es obligatorio.';
  } else if (datos.nombre.trim().length < 2) {
    errores.nombre = 'El nombre debe tener al menos 2 caracteres.';
  }

  if (!datos.apellidos.trim()) {
    errores.apellidos = 'Los apellidos son obligatorios.';
  } else if (datos.apellidos.trim().length < 2) {
    errores.apellidos = 'Ingresa tus apellidos completos.';
  }

  const errorEmail = validarCorreo(datos.email);

  if (errorEmail) {
    errores.email = errorEmail;
  }

  if (!datos.password) {
    errores.password = 'La contraseña es obligatoria.';
  } else if (datos.password.length < 6) {
    errores.password = 'La contraseña debe tener al menos 6 caracteres.';
  }

  return errores;
}

export default function Registro() {
  const [usuario, setUsuario] = useState({
    ...datosIniciales
  });

  const [tocados, setTocados] = useState({});
  const [intentoRegistro, setIntentoRegistro] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const errores = validarFormulario(usuario);

  // Comprobar si se debe mostrar un error
  const campoInvalido = (campo) =>
    Boolean(errores[campo]) &&
    (Boolean(tocados[campo]) || intentoRegistro);

  // Marcar campo como revisado
  const marcarTocado = (campo) => {
    setTocados((anterior) => ({
      ...anterior,
      [campo]: true
    }));
  };

  // Actualizar formulario
  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setUsuario((anterior) => ({
      ...anterior,
      [name]: value
    }));

    setMensaje(null);
  };

  // Registrar usuario
  const manejarEnvio = (e) => {
    e.preventDefault();

    setIntentoRegistro(true);
    setMensaje(null);

    const erroresActuales = validarFormulario(usuario);

    // No guardar si hay errores
    if (Object.keys(erroresActuales).length > 0) {
      setMensaje({
        tipo: 'danger',
        texto: 'Corrige los campos señalados antes de continuar.'
      });
      return;
    }

    try {
      inicializarStorage();

      const usuarios = JSON.parse(
        localStorage.getItem('usuarios') || '[]'
      );

      if (!Array.isArray(usuarios)) {
        throw new Error('Datos de usuarios inválidos');
      }

      const run = normalizarRun(usuario.run);
      const email = usuario.email.trim().toLowerCase();

      const existe = usuarios.some((u) => {
        const runRegistrado = normalizarRun(
          String(u.run || '')
        );

        const emailRegistrado = String(
          u.email || ''
        ).trim().toLowerCase();

        return (
          runRegistrado === run ||
          emailRegistrado === email
        );
      });

      if (existe) {
        setMensaje({
          tipo: 'danger',
          texto: 'Ya existe una cuenta con ese RUN o correo electrónico.'
        });
        return;
      }

      // Registro local de demostración
      const nuevoUsuario = {
        run,
        nombre: usuario.nombre.trim(),
        apellidos: usuario.apellidos.trim(),
        email,
        password: usuario.password,
        tipo: 'Cliente'
      };

      const nuevosUsuarios = [
        ...usuarios,
        nuevoUsuario
      ];

      localStorage.setItem(
        'usuarios',
        JSON.stringify(nuevosUsuarios)
      );

      setMensaje({
        tipo: 'success',
        texto: 'Usuario registrado correctamente.'
      });

      setUsuario({ ...datosIniciales });
      setTocados({});
      setIntentoRegistro(false);

    } catch {
      setMensaje({
        tipo: 'danger',
        texto: 'Ocurrió un error al guardar el usuario.'
      });
    }
  };

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">

          <div className="card shadow-sm">

            <div
              className="card-header fw-bold py-3"
              style={{
                backgroundColor: '#5c3a21',
                color: '#ffffff'
              }}
            >
              Registro de Usuario
            </div>

            <div className="card-body p-4">

              <p className="text-muted mb-3">
                Completa tus datos para registrarte en Maderas Finas.
              </p>

              <p className="small text-muted mb-4">
                Todos los campos son obligatorios.
              </p>

              {mensaje && (
                <div
                  className={`alert alert-${mensaje.tipo}`}
                  role="alert"
                >
                  {mensaje.texto}
                </div>
              )}

              <form onSubmit={manejarEnvio} noValidate>

                {/* RUN */}
                <div className="mb-3">
                  <label
                    htmlFor="registro-run"
                    className="form-label fw-semibold"
                  >
                    RUN <span className="text-danger">*</span>
                  </label>

                  <input
                    id="registro-run"
                    type="text"
                    name="run"
                    className={`form-control ${
                      campoInvalido('run') ? 'is-invalid' : ''
                    }`}
                    placeholder="12.345.678-9"
                    value={usuario.run}
                    onChange={manejarCambio}
                    onBlur={() => marcarTocado('run')}
                    autoComplete="off"
                    maxLength={15}
                    required
                  />

                  {campoInvalido('run') && (
                    <div className="invalid-feedback">
                      {errores.run}
                    </div>
                  )}
                </div>

                {/* NOMBRE */}
                <div className="mb-3">
                  <label
                    htmlFor="registro-nombre"
                    className="form-label fw-semibold"
                  >
                    Nombre <span className="text-danger">*</span>
                  </label>

                  <input
                    id="registro-nombre"
                    type="text"
                    name="nombre"
                    className={`form-control ${
                      campoInvalido('nombre') ? 'is-invalid' : ''
                    }`}
                    value={usuario.nombre}
                    onChange={manejarCambio}
                    onBlur={() => marcarTocado('nombre')}
                    autoComplete="given-name"
                    maxLength={80}
                    required
                  />

                  {campoInvalido('nombre') && (
                    <div className="invalid-feedback">
                      {errores.nombre}
                    </div>
                  )}
                </div>

                {/* APELLIDOS */}
                <div className="mb-3">
                  <label
                    htmlFor="registro-apellidos"
                    className="form-label fw-semibold"
                  >
                    Apellidos <span className="text-danger">*</span>
                  </label>

                  <input
                    id="registro-apellidos"
                    type="text"
                    name="apellidos"
                    className={`form-control ${
                      campoInvalido('apellidos') ? 'is-invalid' : ''
                    }`}
                    value={usuario.apellidos}
                    onChange={manejarCambio}
                    onBlur={() => marcarTocado('apellidos')}
                    autoComplete="family-name"
                    maxLength={100}
                    required
                  />

                  {campoInvalido('apellidos') && (
                    <div className="invalid-feedback">
                      {errores.apellidos}
                    </div>
                  )}
                </div>

                {/* CORREO ELECTRÓNICO */}
                <div className="mb-3">
                  <label
                    htmlFor="registro-email"
                    className="form-label fw-semibold"
                  >
                    Correo electrónico <span className="text-danger">*</span>
                  </label>

                  <input
                    id="registro-email"
                    type="email"
                    name="email"
                    className={`form-control ${
                      campoInvalido('email') ? 'is-invalid' : ''
                    }`}
                    value={usuario.email}
                    onChange={manejarCambio}
                    onBlur={() => marcarTocado('email')}
                    autoComplete="email"
                    placeholder="Ingresa tu correo personal"
                    maxLength={254}
                    required
                  />

                  {campoInvalido('email') && (
                    <div className="invalid-feedback">
                      {errores.email}
                    </div>
                  )}

                  <small className="text-muted">
                    No se permiten correos de ejemplo.
                  </small>
                </div>

                {/* CONTRASEÑA */}
                <div className="mb-4">
                  <label
                    htmlFor="registro-password"
                    className="form-label fw-semibold"
                  >
                    Contraseña <span className="text-danger">*</span>
                  </label>

                  <input
                    id="registro-password"
                    type="password"
                    name="password"
                    className={`form-control ${
                      campoInvalido('password') ? 'is-invalid' : ''
                    }`}
                    value={usuario.password}
                    onChange={manejarCambio}
                    onBlur={() => marcarTocado('password')}
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />

                  {campoInvalido('password') && (
                    <div className="invalid-feedback">
                      {errores.password}
                    </div>
                  )}

                  <small className="text-muted">
                    Mínimo 6 caracteres.
                  </small>
                </div>

                {/* BOTÓN DE REGISTRO */}
                <button
                  type="submit"
                  className="btn w-100 fw-bold py-3"
                  style={{
                    backgroundColor: '#5c3a21',
                    borderColor: '#5c3a21',
                    color: '#ffffff',
                    borderRadius: '10px'
                  }}
                >
                  Crear cuenta
                </button>

                <p className="text-center text-muted small mt-3 mb-0">
                  * Campos obligatorios
                </p>

              </form>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}