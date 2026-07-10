import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockProjects } from '../data/mockData';
import Navbar from '../components/Navbar';
import KanbanBoard from '../components/KanbanBoard';

const ProjectKanbanPage = () => {
  const { id } = useParams<{ id: string }>();
  
  const project = useMemo(() => {
    return mockProjects.find(p => p.id === id);
  }, [id]);

  if (!project) {
    return (
      <div className="min-vh-100 bg-light">
        <Navbar />
        <div className="container mt-5 text-center">
          <h2>Projeto não encontrado</h2>
          <Link to="/" className="btn btn-primary mt-3">Voltar para Projetos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column vh-100 bg-light">
      <Navbar />
      
      <div className="container-fluid flex-grow-1 d-flex flex-column overflow-hidden pb-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-3">
            <Link to="/" className="btn btn-sm btn-outline-secondary">
              <i className="bi bi-arrow-left"></i>
            </Link>
            <h3 className="fw-bold mb-0 text-dark">{project.name}</h3>
          </div>
          
          <button className="btn btn-primary d-flex align-items-center gap-2">
            <i className="bi bi-plus-lg"></i>
            Nova Tarefa
          </button>
        </div>

        <div className="flex-grow-1 overflow-hidden">
          <KanbanBoard project={project} />
        </div>
      </div>
    </div>
  );
};

export default ProjectKanbanPage;
