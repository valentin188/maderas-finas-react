
import React, { useState } from 'react';

export default function Login({ usuarioActual, setUsuarioActual }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const manejarEnvio = (e) => {
    e.preventDefault();

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const usuario = usuarios.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() &&
           u.password === password
    );

    if (!usuario) {
      alert('Correo electrónico o contraseña incorrectos.');
      return;
    }

    setUsuarioActual(usuario);
    alert(`Bienvenido/a, ${usuario.nombre}.`);
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
                <form onSubmit={manejarEnvio}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control"
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Iniciar Sesión
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
