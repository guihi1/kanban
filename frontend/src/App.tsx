import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectsPage from './pages/ProjectsPage';
import ProjectKanbanPage from './pages/ProjectKanbanPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectKanbanPage />} />
      </Routes>
    </Router>
  );
}

export default App;
