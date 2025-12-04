import React, { useState, useEffect } from "react";
// Importar componentes
import ToDoInput from './ToDoInput';
import ToDoItem from './ToDoItem';
import ToDoFooter from './ToDoFooter';
// import '../App.css'; 

const API_URL = "https://playground.4geeks.com/todo";
const USERNAME = "gahervi"; // Reemplaza con tu nombre de usuario para el endpoint

const Home = () => {
  // El estado ahora guarda objetos de tarea (como exige la API)
  // Estructura de tarea de la API: { id: number, label: string, is_done: boolean }
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // Función para obtener las tareas del servidor
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

  // **Cargar tareas al iniciar (useEffect)**
  useEffect(() => {
    fetchTodos();
  }, []); // Se ejecuta solo una vez al montar el componente

  // Lógica para añadir una tarea (POST)
  const addTask = async (taskTitle) => {
    if (taskTitle.trim() === "") return;
    
    // El objeto tarea que espera la API
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
      
      // Una vez añadida, limpiamos el input y actualizamos la lista (GET)
      setInputValue("");
      await fetchTodos();

    } catch (error) {
      console.error("Error en addTask:", error);
    }
  };

  // Lógica para eliminar una tarea (DELETE)
  // Nota: La API requiere el 'id' de la tarea, no el índice del array
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/todos/${taskId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        // En este caso, un 404 (tarea no encontrada) también puede considerarse "éxito" si ya no está
        throw new Error(`Error al eliminar tarea: ${response.status}`);
      }
      
      // Una vez eliminada, actualizamos la lista (GET)
      await fetchTodos();

    } catch (error) {
      console.error("Error en deleteTask:", error);
    }
  };
  
  // Lógica para limpiar todas las tareas (DELETE para el usuario)
  const deleteAllTasks = async () => {
    try {
      // Elimina *todas* las tareas del usuario borrando el usuario en sí
      const response = await fetch(`${API_URL}/users/${USERNAME}`, {
        method: "DELETE"
      });
      
      if (!response.ok) {
        throw new Error(`Error al limpiar tareas: ${response.status}`);
      }
      
      console.log("Todas las tareas eliminadas del servidor.");
      // Después de eliminar, recarga (lo que forzará la creación de un usuario nuevo y lista vacía)
      await fetchTodos();
      
    } catch (error) {
      console.error("Error en deleteAllTasks:", error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="w-100" style={{ maxWidth: "550px" }}>
        
        {/* Título Estilizado */}
        <div className="text-center">
            <h1 className="main-title">todos</h1>
        </div>

        {/* Contenedor principal de la lista (Card de Bootstrap) */}
        <div className="card shadow-lg rounded-0">
            
            {/* 1. Componente de Input */}
            <ToDoInput 
                inputValue={inputValue}
                setInputValue={setInputValue}
                onAddTask={addTask}
            />

            {/* 2. Lista de Tareas */}
            <ul className="list-group list-group-flush rounded-0">
                
                {todos.length === 0 ? (
                    // Mensaje de lista vacía
                    <ToDoFooter count={todos.length} /> 
                ) : (
                    // Si hay tareas, renderizamos cada ToDoItem
                    todos.map((task) => (
                        <ToDoItem
                            key={task.id} // Usamos el ID de la API como key
                            task={task.label} // Pasamos solo el label
                            taskId={task.id} // Pasamos el ID para eliminar
                            onDelete={deleteTask}
                        />
                    ))
                )}
            </ul>
            
            {/* 3. Componente de Contador y Botón de Limpieza (solo si hay tareas) */}
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