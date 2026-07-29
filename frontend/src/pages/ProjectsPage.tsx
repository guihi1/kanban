import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit2, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import { api } from "../services/api";
import type { Project } from "../models/types";

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectName, setProjectName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await api.getMyProjects();
      setProjects(data);
    } catch (err) {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setProjectName("");
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setProjectName(project.name);
    setIsModalOpen(true);
  };

  const handleSaveProject = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    try {
      setIsSaving(true);
      if (editingProject) {
        const updated = await api.updateProject({
          ...editingProject,
          name: projectName,
        });
        setProjects(projects.map((p) => (p.id === updated.id ? updated : p)));
      } else {
        const created = await api.createProject({
          name: projectName,
          owner: await api.getMe(),
          boards: [],
        });
        setProjects([...projects, created]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert("Failed to save project");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      await api.deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      alert("Failed to delete project");
    }
  };

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-12 w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Projects</h2>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors"
          >
            <Plus size={16} />
            New Project
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {projects.length === 0 && !error ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No projects found
            </h3>
            <p className="text-slate-500 mb-6">
              Create your first project to get started.
            </p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors"
            >
              <Plus size={16} />
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow group relative"
              >
                {/* Actions */}
                <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(project)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <h5 className="font-bold text-lg text-slate-900 mb-4 pr-16 truncate">
                  {project.name}
                </h5>

                <div className="flex justify-between text-sm text-slate-500 mb-6">
                  <span>{project.boards?.length || 0} Boards</span>
                  <span>
                    {project.boards?.reduce(
                      (acc, b) => acc + (b.tasks?.length || 0),
                      0,
                    ) || 0}{" "}
                    Tasks
                  </span>
                </div>

                <Link
                  to={`/projects/${project.id}`}
                  className="block w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-lg transition-colors"
                >
                  Open Kanban
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSaving && setIsModalOpen(false)}
        title={editingProject ? "Edit Project" : "Create New Project"}
      >
        <form onSubmit={handleSaveProject} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Project Name
            </label>
            <input
              type="text"
              required
              autoFocus
              disabled={isSaving}
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              placeholder="e.g. Website Redesign"
            />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !projectName.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Project"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectsPage;
