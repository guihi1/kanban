import { Droppable } from '@hello-pangea/dnd';
import type { Board } from '../models/types';
import TaskCard from './TaskCard';

const KanbanColumn = ({ board }: { board: Board }) => {
  return (
    <div className="col-12 col-md-6 col-xl-4 mb-4">
      <div className="bg-light p-3 rounded shadow-sm h-100 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0 fw-bold text-secondary">{board.title}</h5>
          <span className="badge bg-secondary rounded-pill">
            {board.tasks.length}
          </span>
        </div>
        
        <Droppable droppableId={board.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex-grow-1 p-2 rounded ${snapshot.isDraggingOver ? 'bg-secondary bg-opacity-10' : ''}`}
              style={{ minHeight: '150px' }}
            >
              {board.tasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default KanbanColumn;
