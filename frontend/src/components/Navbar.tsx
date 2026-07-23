import { Plus, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-mono font-bold text-lg">
          K
        </div>

        {/* Title and subtitle */}
        <div className="flex flex-col">
          <h1 className="font-mono text-xl font-bold tracking-tight text-slate-900 leading-tight">
            kanban
          </h1>
          <span className="font-mono text-xs text-slate-400 tracking-wide">
            Product &middot; Sprint 24
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-600">
            {user?.username || "Guest"}
          </span>
          <button
            onClick={logout}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>

        <div className="h-6 w-px bg-slate-200"></div>

        {/* New task button */}
        <button className="flex items-center gap-1.5 bg-slate-900 text-white px-4 py-2 rounded-lg font-mono text-sm hover:bg-slate-800 transition-colors">
          <Plus size={16} />
          New task
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
