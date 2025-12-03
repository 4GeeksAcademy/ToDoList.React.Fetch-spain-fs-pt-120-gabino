import React from 'react';

const ToDoInput = ({ inputValue, setInputValue, onAddTask }) => {
  const handleKeyDown = (e) => {
    // Agregando tarera con la tecla Enter
    if (e.key === "Enter" && inputValue.trim() !== "") {
      onAddTask(inputValue);
    }
  };

  return (
    <div className="px-4 pb-2">
      <input
        type="text"
        className="form-control form-control-lg shadow-none fst-italic rounded-0 border-start-0 border-end-0 border-top-0 border-bottom"
        placeholder="¿Qué necesitas hacer?"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default ToDoInput;