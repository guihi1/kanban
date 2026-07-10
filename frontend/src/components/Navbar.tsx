import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <i className="bi bi-kanban"></i>
          Kanban App
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Projetos</Link>
            </li>
          </ul>
          <div className="d-flex align-items-center text-white">
            <i className="bi bi-person-circle fs-5 me-2"></i>
            <span>joao.silva</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
