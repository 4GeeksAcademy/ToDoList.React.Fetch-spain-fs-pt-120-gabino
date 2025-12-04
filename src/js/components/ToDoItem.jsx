import React from 'react';

// Ahora recibe task, taskId y onDelete
const ToDoItem = ({ task, taskId, onDelete }) => { 
  return (
    <li
      className="list-group-item d-flex justify-content-between align-items-center py-3 px-4 text-secondary"
      style={{ fontSize: "1.2rem" }}
    >
      {/* Texto de la tarea */}
      <span>{task}</span>

      {/* Ícono de eliminar. Llama a onDelete con el ID de la tarea */}
      <span
        className="delete-icon text-danger fw-bold me-2"
        onClick={() => onDelete(taskId)} // Pasa el taskId
      >
        ✖
      </span>
    </li>
  );
};

export default ToDoItem;