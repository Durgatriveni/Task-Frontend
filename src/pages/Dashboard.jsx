import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaEdit, FaTrash } from "react-icons/fa";
import DataTable from "react-data-table-component";


export default function Dashboard() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("Pending");
  const [editingTask, setEditingTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterUser, setFilterUser] = useState("");
  
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (!storedRole) {
      navigate("/");
    } else {
      setRole(storedRole);
      fetchTasks(storedRole);
    }
  }, [navigate]);

  const fetchTasks = async (storedRole) => {
    try {
      const url = storedRole === "admin" ? "http://localhost:5000/tasks/all" : "http://localhost:5000/tasks";
      const response = await axios.get(url, { withCredentials: true });
      setTasks(response.data);
      setFilteredTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  useEffect(() => {
    const filtered = tasks.filter((task) =>
      task.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.taskDescription.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTasks(filtered);
  }, [searchQuery, tasks]);
  const sortTasks = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredTasks(sortedTasks);
  };

  // const handleTaskSubmit = async () => {
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:5000/tasks",
  //       { taskName, taskDescription, priority, dueDate, status },
  //       { withCredentials: true }
  //     );
  //     console.log("Task added:", response.data); // Debugging
  //     setTasks([...tasks, response.data]);
  //   } catch (error) {
  //     console.error("Error adding task:", error);
  //   }
  // };
  const handleTaskSubmit = async () => {
    try {
      if (editingTask) {
        // Update task
        const response = await axios.put(
          `http://localhost:5000/tasks/${editingTask.taskId}`,
          { taskName, taskDescription, priority, dueDate, status },
          { withCredentials: true }
        );
        console.log("Task updated:", response.data);
  
        // Update the task in the tasks state
        setTasks(tasks.map((task) => (task.taskId === editingTask.taskId ? response.data : task)));
      } else {
        // Add new task
        const response = await axios.post(
          "http://localhost:5000/tasks",
          { taskName, taskDescription, priority, dueDate, status },
          { withCredentials: true }
        );
        console.log("Task added:", response.data);
        setTasks([...tasks, response.data]);
      }
  
      closeModal();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };
  
  
  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`, { withCredentials: true });
      setTasks(tasks.filter((task) => task.taskId !== taskId));
    } catch (error) {
      console.log("Error deleting task:", error);
    }
  };

  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setTaskName(task.taskName);
      setTaskDescription(task.taskDescription);
      setPriority(task.priority);
      setDueDate(task.dueDate);
      setStatus(task.status);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const resetForm = () => {
    setEditingTask(null);
    setTaskName("");
    setTaskDescription("");
    setPriority("Low");
    setDueDate("");
    setStatus("Pending");
  };
  const columns = [
    role === "admin"
      ? {
          name: "Username",
          selector: (row) => row.username,
          sortable: true,
        }
      : null,
    {
      name: "Task Name",
      selector: (row) => row.taskName,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.taskDescription,
      sortable: false,
    },
    {
      name: "Priority",
      selector: (row) => row.priority,
      sortable: true,
    },
    {
      name: "Due Date",
      selector: (row) => new Date(row.dueDate).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Created On",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(), 
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    role !== "admin"
      ? {
          name: "Edit",
          cell: (row) => (
            <button onClick={() => openModal(row)} className="text-blue-500 hover:underline">
              <FaEdit size={18} />
            </button>
          ),
        }
      : null,
    {
      name: "Delete",
      cell: (row) => (
        <button onClick={() => deleteTask(row.taskId)} className="text-red-500 hover:underline">
          <FaTrash size={18} />
        </button>
      ),
    },
  ].filter(Boolean); // Remove null values from columns
  
  const applyFilters = () => {
    let filtered = tasks;
  
    if (filterPriority) {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }
  
    if (filterStatus) {
      filtered = filtered.filter(task => task.status === filterStatus);
    }
  
    if (filterUser) {
      filtered = filtered.filter(task => task.username?.toLowerCase().includes(filterUser.toLowerCase()));
    }
  
    setFilteredTasks(filtered);
    setIsFilterModalOpen(false);
  };
  const clearFilters = () => {
    setFilterPriority("");
    setFilterStatus("");
    setFilterUser("");
    setFilteredTasks(tasks);
  };
  
  return (
    <>
      <Navbar />
      <div className="flex flex-col  bg-gray-100 min-h-screen p-4">
        <div className="bg-white p-6 rounded-xl shadow-md w-full ">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            {role === "admin" ? "Welcome Admin!" : "Welcome User!"}
          </h1>
          <div className="flex justify-between items-center gap-4 mt-4 flex-wrap  gap-4 mt-4">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            // className="w-2/4 p-2 border rounded-md mt-4"
            className="flex-2 min-w-[200px] p-2 border rounded-md"
          />
          <div className="">
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="p-3 bg-purple-500 text-white rounded-md shadow-md hover:bg-purple-600 w-full sm:w-auto"
          >
          Filter
        </button>
      </div>
          {role!=="admin"&&(
             <button onClick={() => openModal()}  className="p-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 w-full sm:w-auto"
>
             Add New Task
           </button>
          )}
            {/* Filter Button */}
      
      {/* Filter Modal */}
      {isFilterModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
    <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">Filter Tasks</h2>
        <button
          className="text-gray-600 hover:text-gray-900"
          onClick={() => setIsFilterModalOpen(false)}
        >
          ✕ {/* Correct close button */}
        </button>
      </div>
      <select
        value={filterPriority}
        onChange={(e) => setFilterPriority(e.target.value)}
        className="w-full p-2 border rounded-md mb-2"
      >
        <option value="">All Priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="w-full p-2 border rounded-md mb-2"
      >
        <option value="">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <input
        type="text"
        value={filterUser}
        onChange={(e) => setFilterUser(e.target.value)}
        placeholder="Filter by user"
        className="w-full p-2 border rounded-md mb-4"
      />

      <div className="flex justify-between">
        <button
          onClick={applyFilters}
          className="p-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 w-full sm:w-auto"
        >
          Apply Filters
        </button>
        
        <button
          onClick={clearFilters}
          className="p-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 w-full sm:w-auto ml-2"
        >
          Clear Filters
        </button>
      </div>
    </div>
  </div>
)}

   </div>

<div  className="relative z-10 mt-5">
<DataTable
  columns={columns}
  data={filteredTasks}
  pagination
  highlightOnHover
  striped
  responsive
  customStyles={{
    headCells: {
      style: {
        backgroundColor: "#bd3ed6", // Blue header background
        color: "white", // White text
        fontSize: "18px", // Larger font size
        fontWeight: "bold", // Bold text
        textAlign: "center",
        padding: "10px",
        position: "relative",
      },
    },
    cells: {
      style: {
        fontSize: "16px", 
        padding: "8px",
      },
    },
  }}
  sortIcon={<span className="text-white">▲</span>}
/>


          </div>
        </div>
      </div>
    {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-semibold mb-3">{editingTask ? "Edit Task" : "Add New Task"}</h2>
      
      <input
        type="text"
        placeholder="Task Name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        className="w-full p-2 border rounded-md mb-2"
      />

      <textarea
        placeholder="Description"
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
        className="w-full p-2 border rounded-md mb-2"
      ></textarea>

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="w-full p-2 border rounded-md mb-2"
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full p-2 border rounded-md mb-2"
      >
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full p-2 border rounded-md mb-2"
      />

      <button
        onClick={handleTaskSubmit}
        className="w-full p-2 bg-purple-500 text-white rounded-md mt-2"
      >
        {editingTask ? "Update" : "Add"} Task
      </button>

      <button
        onClick={closeModal}
        className="w-full p-2 bg-gray-400 text-white rounded-md mt-2"
      >
        Cancel
      </button>
    </div>
  </div>
)}

    </>
  );
}