import Header from './components/Header'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import Footer from './components/Footer'
import About from './components/About'
import {useState, useEffect} from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'

function App() {
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);

  useEffect(() => {
    const getTasks = async() => {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer);
    }

    getTasks();
  
  }, []);

  const fetchTasks = async() => {
    const response = await fetch('https://my-json-server.typicode.com/kennyphan100/Task-Tracker-DB/tasks');
    const data = await response.json();
    return data;
  }

  // Fetch Task
  const fetchTask = async(id) => {
    const response = await fetch(`https://my-json-server.typicode.com/kennyphan100/Task-Tracker-DB/tasks/${id}`);
    const data = await response.json();
    return data;
  }

  // Delete Task
  const deleteTask = async(id) => {
    await fetch(`https://my-json-server.typicode.com/kennyphan100/Task-Tracker-DB/tasks/${id}`, {
      method: 'DELETE',
    });

    setTasks(tasks.filter((task) => task.id !== id))
  }

  // Toggle Reminder (Update Task)
  const toggleReminder = async(id) => {
    const taskToToggle = await fetchTask(id);
    const updTask = {...taskToToggle, reminder: !taskToToggle.reminder};

    const response = await fetch(`https://my-json-server.typicode.com/kennyphan100/Task-Tracker-DB/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type':'application/json'
      },
      body: JSON.stringify(updTask)
    });

    const data = await response.json();

    setTasks(tasks.map((task) => task.id === id ? {...task, reminder: data.reminder} : task))
  }

  // Add Task
  const addTask = async(task) => {
    const response = await fetch('https://my-json-server.typicode.com/kennyphan100/Task-Tracker-DB/tasks', {
      method: 'POST',
      headers: {
        'Content-type':'application/json'
      },
      body: JSON.stringify(task)
    });

    const data = await response.json();

    setTasks([...tasks, data]);
  }

  return (
    <Router>
      <div className="container">
        <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask}/>

        <Routes>
          <Route path='/Task-Tracker/' exact element={(
            <>
              {showAddTask && <AddTask onAdd={addTask}/>}
              {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/> : ('No Tasks')}
            </>
          )}/>
          
          <Route path='/about' element={<About/>}/>
        </Routes>
        
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
