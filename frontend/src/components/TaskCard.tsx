import { Draggable } from '@hello-pangea/dnd';
import type { Task } from '../models/types';
import TagBadge from './TagBadge';

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'alta': return 'text-danger';
    case 'média': return 'text-warning';
    case 'baixa': return 'text-success';
    default: return 'text-secondary';
  }
};

const TaskCard = ({ task, index }: { task: Task; index: number }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`card mb-3 shadow-sm ${snapshot.isDragging ? 'border-primary' : ''}`}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.9 : 1,
            cursor: 'grab'
          }}
        >
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h6 className="card-title mb-0 fw-bold">{task.title}</h6>
              <span title="Prioridade">
                <i className={`bi bi-flag-fill ${getPriorityColor(task.priority)}`}></i>
              </span>
            </div>
            
            {task.description && (
              <p className="card-text text-muted small mb-2">{task.description}</p>
            )}
            
            {task.tags && task.tags.length > 0 && (
              <div className="mb-2">
                {task.tags.map((tag, i) => (
                  <TagBadge key={i} tag={tag} />
                ))}
              </div>
            )}
            
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="small text-muted" title="Data de entrega">
                <i className="bi bi-calendar-event me-1"></i>
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
              
              {task.assignees && task.assignees.length > 0 && (
                <div className="d-flex" title="Atribuído">
                  {task.assignees.map((assignee, i) => (
                    <i key={i} className="bi bi-person-circle fs-5 text-secondary ms-1" title={assignee.username}></i>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
