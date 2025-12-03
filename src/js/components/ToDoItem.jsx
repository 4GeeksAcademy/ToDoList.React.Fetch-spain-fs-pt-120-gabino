import React from 'react';

const ToDoItem = ({ task, index, onDelete }) => {
  return (
    <li
      className="list-group-item d-flex justify-content-between align-items-center py-3 px-4 text-secondary"
      style={{ fontSize: "1.2rem" }}
    >
      {/* Contenido de la tarea */}
      <span>{task}</span>

      {/* Ícono de eliminar. Clase `delete-icon` aplicada efecto hover en index.css */}
      <span
        className="delete-icon text-danger fw-bold me-2"
        onClick={() => onDelete(index)}
      >
        ✖
      </span>
    </li>
  );
};

export default ToDoItem;