import { Link } from 'react-router-dom';
import { mockProjects } from '../data/mockData';
import Navbar from '../components/Navbar';

const ProjectsPage = () => {
  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-dark">Meus Projetos</h2>
          <button className="btn btn-primary d-flex align-items-center gap-2">
            <i className="bi bi-plus-lg"></i>
            Novo Projeto
          </button>
        </div>

        <div className="row g-4">
          {mockProjects.map(project => (
            <div key={project.id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0 transition-hover">
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-3">{project.name}</h5>
                  
                  <div className="d-flex justify-content-between text-muted small mb-4">
                    <span>
                      <i className="bi bi-layout-three-columns me-2"></i>
                      {project.boards.length} Quadros
                    </span>
                    <span>
                      <i className="bi bi-card-checklist me-2"></i>
                      {project.boards.reduce((acc, b) => acc + b.tasks.length, 0)} Tarefas
                    </span>
                  </div>
                  
                  <Link to={`/projects/${project.id}`} className="btn btn-outline-primary w-100">
                    Acessar Kanban
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
