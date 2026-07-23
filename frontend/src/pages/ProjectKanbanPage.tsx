import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import KanbanBoard from '../components/KanbanBoard';
import { api } from '../services/api';
import type { Project } from '../models/types';

const ProjectKanbanPage = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!id) return;
        const data = await api.getProject(Number(id));
        setProject(data);
      } catch (err) {
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500 font-mono">Loading board...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold text-slate-800 font-mono mb-2">Project not found</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <Link to="/projects" className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-mono text-sm">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <Navbar />
      
      <div className="flex-1 flex flex-col pt-8 pb-4 overflow-hidden">
        <div className="px-8 mb-6 flex flex-col gap-4">
          <div>
            <Link to="/projects" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium">
              <ArrowLeft size={16} />
              Back to Projects
            </Link>
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="font-mono text-3xl font-bold text-slate-900 tracking-tight">
              {project.name}
            </h2>
            <p className="font-mono text-sm text-slate-400">
              Drag work across stages. Everything auto-saves.
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <KanbanBoard initialProject={project} />
        </div>
      </div>
    </div>
  );
};

export default ProjectKanbanPage;
