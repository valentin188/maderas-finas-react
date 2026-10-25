import { useState } from 'react';
import { inicializarStorage } from '../data/mockData';
import { regionesChile } from '../data/ubicaciones';
import { correoValido, runValido, telefonoValido } from '../data/validaciones';

const hoy = new Date();
const fechaMaxima = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;

export default function Registro() {
  const [usuario, setUsuario] = useState({run: '', nombre: '', apellidos: '', email: '', telefono: '', fechaNac: '', region: '', comuna: '', direccion: '', password: '', tipo: 'Cliente'
  });

  const manejarCambio = (e) => {const { name, value } = e.target;
    setUsuario({
      ...usuario,
      [name]: value,
      ...(name === 'region' ? { comuna: '' } : {}),
    });
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    inicializarStorage();

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const run = usuario.run.trim().toUpperCase();
    const email = usuario.email.trim().toLowerCase();
    const nombre = usuario.nombre.trim();
    const apellidos = usuario.apellidos.trim();
    const direccion = usuario.direccion.trim();

    if (!runValido(run)) {
      alert('Ingresa un RUN válido, sin puntos ni guion.');
      return;
    }

    if (!nombre || nombre.length > 50) {
      alert('Ingresa un nombre válido (máximo 50 caracteres).');
      return;
    }

    if (!apellidos || apellidos.length > 100) {
      alert('Ingresa apellidos válidos (máximo 100 caracteres).');
      return;
    }

    if (!correoValido(email) || email.length > 100) {
      alert('El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.');
      return;
    }

    if (!telefonoValido(usuario.telefono)) {
      alert('Ingresa un teléfono celular chileno válido, por ejemplo +56912345678.');
      return;
    }

    if (!usuario.region || !usuario.comuna) {
      alert('Debes seleccionar una región y una comuna.');
      return;
    }

    if (!direccion || direccion.length > 300) {
      alert('Ingresa una dirección válida (máximo 300 caracteres).');
      return;
    }

    if (usuario.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    const existe = usuarios.some(u =>
      String(u.run || '').toUpperCase() === run ||
      String(u.email || '').toLowerCase() === email
    );

    if (existe) {
      alert('Ya existe un usuario con ese RUN o correo electrónico.');
      return;
    }

    usuarios.push({
      run,
      nombre,
      apellidos,
      email,
      telefono: usuario.telefono.trim(),
      fechaNac: usuario.fechaNac,
      region: usuario.region,
      comuna: usuario.comuna,
      direccion,
      password: usuario.password,
      tipo: 'Cliente',
    });

    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    alert('Usuario registrado correctamente.');

    setUsuario({ run: '', nombre: '', apellidos: '', email: '', telefono: '', fechaNac: '', region: '', comuna: '', direccion: '', password: '', tipo: 'Cliente'
    });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header fw-bold">
              Registro de Usuario
            </div>

            <div className="card-body">
              <form onSubmit={manejarEnvio}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">RUN</label>
                  <input
                    className="form-control"
                    name="run"
                    value={usuario.run}
                    onChange={manejarCambio}
                    placeholder="12345678K (sin puntos ni guion)"
                    maxLength="9"
                    autoCapitalize="characters"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Nombre</label>
                  <input
                    className="form-control"
                    name="nombre"
                    value={usuario.nombre}
                    onChange={manejarCambio}
                    maxLength="50"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Apellidos</label>
                  <input
                    className="form-control"
                    name="apellidos"
                    value={usuario.apellidos}
                    onChange={manejarCambio}
                    maxLength="100"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={usuario.email}
                    onChange={manejarCambio}
                    autoComplete="email"
                    maxLength="100"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" htmlFor="registro-telefono">Teléfono celular</label>
                  <input
                    id="registro-telefono"
                    type="tel"
                    className="form-control"
                    name="telefono"
                    value={usuario.telefono}
                    onChange={manejarCambio}
                    placeholder="+56912345678"
                    autoComplete="tel"
                    maxLength="20"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" htmlFor="registro-fecha-nac">Fecha de nacimiento</label>
                  <input
                    id="registro-fecha-nac"
                    type="date"
                    className="form-control"
                    name="fechaNac"
                    value={usuario.fechaNac}
                    onChange={manejarCambio}
                    max={fechaMaxima}
                    onClick={(e) => {
                      if (typeof e.currentTarget.showPicker === 'function') e.currentTarget.showPicker();
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" htmlFor="registro-region">Región</label>
                  <select
                    id="registro-region"
                    className="form-select"
                    name="region"
                    value={usuario.region}
                    onChange={manejarCambio}
                    required
                  >
                    <option value="">Seleccione región</option>
                    {regionesChile.map(({ region }) => <option key={region} value={region}>{region}</option>)}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" htmlFor="registro-comuna">Comuna</label>
                  <select
                    id="registro-comuna"
                    className="form-select"
                    name="comuna"
                    value={usuario.comuna}
                    onChange={manejarCambio}
                    required
                    disabled={!usuario.region}
                  >
                    <option value="">Seleccione comuna</option>
                    {(regionesChile.find(({ region }) => region === usuario.region)?.comunas || []).map(comuna => (
                      <option key={comuna} value={comuna}>{comuna}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" htmlFor="registro-direccion">Dirección</label>
                  <textarea
                    id="registro-direccion"
                    className="form-control"
                    name="direccion"
                    value={usuario.direccion}
                    onChange={manejarCambio}
                    maxLength="300"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={usuario.password}
                    onChange={manejarCambio}
                    autoComplete="new-password"
                    minLength="6"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-madera">
                  Registrarse
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
