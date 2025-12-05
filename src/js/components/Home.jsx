import React, { useState, useEffect } from "react";
// Importar componentes
import ToDoInput from './ToDoInput';
import ToDoItem from './ToDoItem';
import ToDoFooter from './ToDoFooter';

const API_URL = "https://playground.4geeks.com/todo";
const USERNAME = "gahervi";

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // Esta función obtiene las tareas
  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${USERNAME}`);
      
      // La API devuelve 404 si el usuario no existe
      if (response.status === 404) {
        // Si no existe, crea el usuario y vuelve a intentar cargar las tareas
        await createUser();
        return; // Sale para no intentar procesar el 404
      }

      if (!response.ok) {
        throw new Error(`Error al cargar tareas: ${response.status}`);
      }

      const data = await response.json();
      // Asegura que 'data.todos' sea un array antes de actualizar el estado
      if (Array.isArray(data.todos)) {
        setTodos(data.todos);
      } else {
        setTodos([]);
      }
    } catch (error) {
      console.error("Error en fetchTodos:", error);
    }
  };

  // Función para crear un usuario si no existe
  const createUser = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${USERNAME}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error al crear usuario: ${response.status}`);
      }
      
      console.log(`Usuario ${USERNAME} creado con éxito.`);
      // Una vez creado, carga las tareas (que ahora será una lista vacía)
      await fetchTodos();

    } catch (error) {
      console.error("Error en createUser:", error);
    }
  };

  // Cargar tareas al iniciar (useEffect)
  useEffect(() => {
    fetchTodos();
  }, []);

  // Lógica para añadir una tarea (POST)
  const addTask = async (taskTitle) => {
    if (taskTitle.trim() === "") return;
    
    const newTask = { 
      label: taskTitle.trim(), 
      is_done: false 
    };

    try {
      const response = await fetch(`${API_URL}/todos/${USERNAME}`, {
        method: "POST",
        body: JSON.stringify(newTask),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Error al añadir tarea: ${response.status}`);
      }
      
      // Se limpia el input
      setInputValue("");
      await fetchTodos();

    } catch (error) {
      console.error("Error en addTask:", error);
    }
  };

  // Lógica para eliminar una tarea (DELETE)
  // En ste ejercicio la API requiere un id y no el índice del array
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/todos/${taskId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar tarea: ${response.status}`);
      }
      
      // Al elilminar se actualiza la lista (GET)
      await fetchTodos();

    } catch (error) {
      console.error("Error en deleteTask:", error);
    }
  };
  
  const deleteAllTasks = async () => {
    try {
      // Elimina todas las tareas y el usuario
      const deleteResponse = await fetch(`${API_URL}/users/${USERNAME}`, {
        method: "DELETE"
  });

  if (!deleteResponse.ok && deleteResponse.status !== 404) {
        throw new Error(`Error al limpiar tareas: ${deleteResponse.status}`);
      }

      console.log("Todas las tareas eliminadas (usuario borrado).");
        
      // Vuelve a crear el usuario.
      await createUser(); 

      // Pregunta por las tareas
      await fetchTodos();
      
    } catch (error) {
      console.error("Error en deleteAllTasks:", error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="w-100" style={{ maxWidth: "550px" }}>
        
        {/* Título */}
        <div className="text-center">
            <h1 className="main-title">ToDos</h1>
        </div>

        {/* Contenedor principal de la lista (Card de Bootstrap) */}
        <div className="card shadow-lg rounded-0">
            
            {/* Componente de Input */}
            <ToDoInput 
                inputValue={inputValue}
                setInputValue={setInputValue}
                onAddTask={addTask}
            />

            {/* Listando las tareas */}
            <ul className="list-group list-group-flush rounded-0">
                
                {todos.length === 0 ? (
                    // Mensaje de lista vacía
                    <ToDoFooter count={todos.length} /> 
                ) : (
                    // Si hay tareas, renderizamos cada ToDoItem
                    todos.map((task) => (
                        <ToDoItem
                            key={task.id} // Se usa el id de la API como llave principal
                            task={task.label} // solo el label
                            taskId={task.id} // ID para eliminar
                            onDelete={deleteTask}
                        />
                    ))
                )}
            </ul>
            
            {/* Contador  si hay alguna tarea, se muestra el botón de eliminar todas */}
            {todos.length > 0 && (
                <>
                    {/* Contador */}
                    <ToDoFooter count={todos.length} />
                    
                    {/* Botón de Limpieza */}
                    <div className="card-footer bg-white text-end">
                        <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={deleteAllTasks}
                        >
                            Limpiar todas las tareas
                        </button>
                    </div>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default Home;