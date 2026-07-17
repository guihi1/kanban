import { Link } from "react-router-dom";
import { mockProjects } from "../data/mockData";
import Navbar from "../components/Navbar";

const ProjectsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Projects</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <h5 className="font-bold text-lg text-slate-900 mb-4">
                {project.name}
              </h5>

              <div className="flex justify-between text-sm text-slate-500 mb-6">
                <span>{project.boards.length} Boards</span>
                <span>
                  {project.boards.reduce((acc, b) => acc + b.tasks.length, 0)}{" "}
                  Tasks
                </span>
              </div>

              <Link
                to={`/projects/${project.id}`}
                className="block w-full text-center bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 rounded-lg transition-colors"
              >
                Open Kanban
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
