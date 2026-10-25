import { useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerUsuarios, guardarUsuarios } from '../../data/mockData';
import { correoValido, runValido, telefonoValido } from '../../data/validaciones';

const USUARIO_VACIO = { run: '', nombre: '', apellidos: '', email: '', telefono: '', direccion: '', password: '', tipo: 'Cliente' };

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState(() => obtenerUsuarios());
  const [nuevoUsuario, setNuevoUsuario] = useState(USUARIO_VACIO);

  const manejarCambio = (e) => setNuevoUsuario(actual => ({ ...actual, [e.target.name]: e.target.value }));

  const crearUsuario = (e) => {
    e.preventDefault();
    const run = nuevoUsuario.run.trim().toUpperCase();
    const nombre = nuevoUsuario.nombre.trim();
    const apellidos = nuevoUsuario.apellidos.trim();
    const email = nuevoUsuario.email.trim().toLowerCase();
    if (!runValido(run)) return alert('Ingresa un RUN válido, sin puntos ni guion.');
    if (!nombre || nombre.length > 50 || !apellidos || apellidos.length > 100) return alert('Ingresa nombre y apellidos válidos.');
    if (!correoValido(email) || email.length > 100) return alert('El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.');
    if (nuevoUsuario.password.length < 6) return alert('La contraseña debe tener al menos 6 caracteres.');
    if (nuevoUsuario.telefono && !telefonoValido(nuevoUsuario.telefono)) return alert('Ingresa un teléfono celular chileno válido, por ejemplo +56912345678.');
    if (nuevoUsuario.direccion.trim() && nuevoUsuario.direccion.trim().length < 5) return alert('Ingresa una dirección más completa o deja el campo vacío.');
    if (usuarios.some(u => String(u.run || '').toUpperCase() === run || String(u.email || '').toLowerCase() === email)) {
      return alert('Ya existe un usuario con ese RUN o correo electrónico.');
    }
    const actualizados = guardarUsuarios([...usuarios, {
      run, nombre, apellidos, email,
      telefono: nuevoUsuario.telefono.trim(), direccion: nuevoUsuario.direccion.trim(),
      password: nuevoUsuario.password, tipo: nuevoUsuario.tipo,
    }]);
    setUsuarios(actualizados);
    setNuevoUsuario(USUARIO_VACIO);
    alert('Usuario creado correctamente.');
  };

  return (
    <section className="container py-5">
      <Link to="/admin" className="btn btn-outline-madera mb-3">Volver al panel</Link>
      <p className="eyebrow mb-1">Administración</p>
      <h1 className="orders-title mb-4">Gestión de usuarios</h1>
      <div className="card shadow-sm mb-4">
        <div className="card-header fw-bold">Crear usuario</div>
        <div className="card-body">
          <form onSubmit={crearUsuario}>
            <div className="row g-3">
              <div className="col-12 col-md-4"><label className="form-label" htmlFor="admin-usuario-run">RUN</label><input id="admin-usuario-run" className="form-control" name="run" value={nuevoUsuario.run} onChange={manejarCambio} placeholder="12345678K (sin puntos ni guion)" maxLength="9" required /></div>
              <div className="col-12 col-md-4"><label className="form-label" htmlFor="admin-usuario-nombre">Nombre</label><input id="admin-usuario-nombre" className="form-control" name="nombre" value={nuevoUsuario.nombre} onChange={manejarCambio} maxLength="50" required /></div>
              <div className="col-12 col-md-4"><label className="form-label" htmlFor="admin-usuario-apellidos">Apellidos</label><input id="admin-usuario-apellidos" className="form-control" name="apellidos" value={nuevoUsuario.apellidos} onChange={manejarCambio} maxLength="100" required /></div>
              <div className="col-12 col-md-6"><label className="form-label" htmlFor="admin-usuario-email">Correo electrónico</label><input id="admin-usuario-email" type="email" className="form-control" name="email" value={nuevoUsuario.email} onChange={manejarCambio} maxLength="100" autoComplete="email" required /></div>
              <div className="col-12 col-md-3"><label className="form-label" htmlFor="admin-usuario-password">Contraseña</label><input id="admin-usuario-password" type="password" className="form-control" name="password" value={nuevoUsuario.password} onChange={manejarCambio} minLength="6" autoComplete="new-password" required /></div>
              <div className="col-12 col-md-3"><label className="form-label" htmlFor="admin-usuario-tipo">Tipo de usuario</label><select id="admin-usuario-tipo" className="form-select" name="tipo" value={nuevoUsuario.tipo} onChange={manejarCambio} required><option value="Cliente">Cliente</option><option value="Vendedor">Vendedor</option><option value="Admin">Admin</option></select></div>
              <div className="col-12 col-md-4"><label className="form-label" htmlFor="admin-usuario-telefono">Teléfono celular (opcional)</label><input id="admin-usuario-telefono" type="tel" className="form-control" name="telefono" value={nuevoUsuario.telefono} onChange={manejarCambio} placeholder="+56912345678" autoComplete="tel" maxLength="20" /></div>
              <div className="col-12 col-md-8"><label className="form-label" htmlFor="admin-usuario-direccion">Dirección de despacho (opcional)</label><input id="admin-usuario-direccion" className="form-control" name="direccion" value={nuevoUsuario.direccion} onChange={manejarCambio} maxLength="150" autoComplete="street-address" /></div>
            </div>
            <button type="submit" className="btn btn-madera mt-4">Crear usuario</button>
          </form>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark"><tr><th>RUN</th><th>Nombre</th><th>Correo electrónico</th><th>Tipo</th></tr></thead>
          <tbody>
            {usuarios.map((u, i) => <tr key={u.run || u.email || i}><td>{u.run || '—'}</td><td>{[u.nombre, u.apellidos].filter(Boolean).join(' ') || '—'}</td><td>{u.email}</td><td><span className="badge user-role-badge">{u.tipo}</span></td></tr>)}
            {!usuarios.length && <tr><td colSpan="4" className="text-center">No hay usuarios registrados.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
