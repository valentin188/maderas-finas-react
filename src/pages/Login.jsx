
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { inicializarStorage } from '../data/mockData';
import { correoValido } from '../data/validaciones';

export default function Login({ usuarioActual, setUsuarioActual }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const manejarEnvio = (e) => {
    e.preventDefault();

    const correo = email.trim().toLowerCase();
    if (!correoValido(correo) || !password) {
      alert('Ingresa un correo válido y tu contraseña.');
      return;
    }

    inicializarStorage();
    let usuarios = [];
    try {
      usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    } catch {
      usuarios = [];
    }

    const usuario = usuarios.find(
      u => u.email?.toLowerCase() === correo &&
           u.password === password
    );

    if (!usuario || !['Cliente', 'Admin', 'Vendedor'].includes(usuario.tipo)) {
      alert('Correo electrónico o contraseña incorrectos.');
      return;
    }

    const usuarioSesion = {
      run: usuario.run,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      email: usuario.email,
      telefono: usuario.telefono,
      region: usuario.region,
      comuna: usuario.comuna,
      direccion: usuario.direccion,
      tipo: usuario.tipo,
    };

    setUsuarioActual(usuarioSesion);
    alert(`Bienvenido/a, ${usuario.nombre}.`);
    navigate(usuario.tipo === 'Admin' ? '/admin' : usuario.tipo === 'Vendedor' ? '/pedidos' : '/', { replace: true });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-header fw-bold">Iniciar Sesión</div>

            <div className="card-body">
              {usuarioActual ? (
                <div className="alert alert-success mb-0">
                  Sesión iniciada como {usuarioActual.nombre}.
                </div>
              ) : (
                <>
                  <form onSubmit={manejarEnvio}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Contraseña
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-madera">
                      Iniciar Sesión
                    </button>
                  </form>
                  <p className="login-register-prompt mb-0 mt-4">
                    ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
