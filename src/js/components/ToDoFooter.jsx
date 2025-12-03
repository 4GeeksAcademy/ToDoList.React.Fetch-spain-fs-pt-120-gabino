import React from 'react';

const ToDoFooter = ({ count }) => {
    if (count === 0) {
        // Estado vacío
        return (
            <li className="list-group-item text-center text-muted py-4 bg-light">
                No hay tareas, añadir tareas
            </li>
        );
    }
    
    // Contador de tareas
    return (
        <div className="card-footer bg-white text-muted small ps-4">
            {count} tarea{count !== 1 ? 's' : ''} pendiente{count !== 1 ? 's' : ''}
        </div>
    );
};

export default ToDoFooter;