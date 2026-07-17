import { Plus } from 'lucide-react';
import { mockUsers } from '../data/mockData';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-mono font-bold text-lg">
          F
        </div>
        
        {/* Title and subtitle */}
        <div className="flex flex-col">
          <h1 className="font-mono text-xl font-bold tracking-tight text-slate-900 leading-tight">
            Flow
          </h1>
          <span className="font-mono text-xs text-slate-400 tracking-wide">
            Product &middot; Sprint 24
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Avatars */}
        <div className="flex -space-x-2">
          {mockUsers.slice(0, 4).map((user, i) => {
            const colors = ['bg-cyan-500', 'bg-purple-500', 'bg-blue-500', 'bg-sky-500'];
            return (
              <div 
                key={user.username}
                className={`w-8 h-8 rounded-full ${colors[i % colors.length]} flex items-center justify-center text-[10px] text-white font-medium border-2 border-white`}
                title={user.username}
              >
                {user.username}
              </div>
            );
          })}
        </div>

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
