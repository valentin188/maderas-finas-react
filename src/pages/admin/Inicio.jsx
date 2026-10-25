import { Link } from 'react-router-dom';

export default function Inicio() {
  return (
    <section className="container-fluid admin-dashboard py-4 px-3 px-lg-4">
      <h1 className="admin-dashboard-title">Panel de administración</h1>
      <p className="admin-dashboard-intro">Bienvenido al sistema de administración de Maderas Finas.</p>
      <p className="admin-dashboard-intro mb-5">Desde este panel puedes gestionar los productos y usuarios del sistema.</p>

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <article className="card admin-dashboard-card h-100">
            <div className="card-body">
              <h2>Productos</h2>
              <p>Consulta y administra los productos disponibles en la tienda.</p>
              <Link to="/admin/productos" className="btn btn-madera">Gestionar productos</Link>
            </div>
          </article>
        </div>
        <div className="col-12 col-lg-6">
          <article className="card admin-dashboard-card h-100">
            <div className="card-body">
              <h2>Usuarios</h2>
              <p>Consulta y administra las cuentas de clientes, vendedores y administradores.</p>
              <Link to="/admin/usuarios" className="btn btn-madera">Gestionar usuarios</Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
