import React, { useState } from 'react';
import { inicializarStorage } from '../data/mockData';

export default function Registro() {
  const [usuario, setUsuario] = useState({run: '', nombre: '', apellidos: '', email: '', password: '', tipo: 'Cliente'
  });

  const manejarCambio = (e) => {const { name, value } = e.target;
    setUsuario({
      ...usuario, [name]: value
    });
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    inicializarStorage();

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const run = usuario.run.trim().toUpperCase();
    const email = usuario.email.trim().toLowerCase();
    const existe = usuarios.some(u => u.run.toUpperCase() === run || u.email.toLowerCase() === email
    );

    if (existe) {
      alert('Ya existe un usuario con ese RUN o correo electrónico.');
      return;
    }

    usuarios.push({...usuario, run, email});

localStorage.setItem('usuarios', JSON.stringify(usuarios));

alert('Usuario registrado correctamente.');

    setUsuario({ run: '', nombre: '', apellidos: '', email: '', password: '', tipo: 'Cliente'
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
                    placeholder="12345678-9"
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

                <button type="submit" className="btn btn-primary">
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
