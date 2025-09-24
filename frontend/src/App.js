import React, { useEffect, useState } from "react";
import {
  Container, Button, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton,
  Box
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import API from "./api";
import TaskFormDialog from "./components/TaskFormDialog";
import { format } from "date-fns";
import { LoadingIndicator } from "./components/LoadingIndicator";



export default function App() {
  const [tasks, setTasks] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading,setLoading]=useState(false);

  const fetchTasks = async () => {
  setLoading(true);
  
  try {
    const res = await API.get("/tasks");
    setTasks(res.data);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { fetchTasks(); }, []);

  const handleSave = async (formData) => {
    if (editingTask) {
      await API.put(`/tasks/${editingTask._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    } else {
      await API.post("/tasks", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    }
    setOpenForm(false);
    setEditingTask(null);
    fetchTasks();
  };

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this task?");
  if (!confirmDelete) return;

  try {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  } catch (err) {
    console.error("Error deleting task:", err);
  }
};


  const handleMarkDone = async (task) => {
    const fd = new FormData();
    fd.append("status", "DONE");
    await API.put(`/tasks/${task._id}`, fd);
    fetchTasks();
  };

  const getDisplayStatus = (task) => {
    const now = new Date();
    const deadline = new Date(task.deadline);

    if (task.status === "DONE") {
      return now > deadline ? "Achieved" : "Done";
    }
    return now > deadline ? "Failed" : "In Progress";
  };

  return (
  <Container sx={{ mt: 4, position: "relative" }}>
    {loading && (
      <Box
  sx={{
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 9999
  }}
>
  <LoadingIndicator />
</Box>
    )}

    <Typography variant="h4" gutterBottom>
      Task Manager
    </Typography>
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={() => { setEditingTask(null); setOpenForm(true); }}
      sx={{ mb: 2 }}
    >
      Add Task
    </Button>

    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Deadline</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map(task => (
            <TableRow key={task._id}>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>{format(new Date(task.deadline), "yyyy-MM-dd")}</TableCell>
              <TableCell>{getDisplayStatus(task)}</TableCell>
              <TableCell>
                <IconButton color="success" onClick={() => handleMarkDone(task)}><DoneIcon /></IconButton>
                {task.linkedFile && (
                  <IconButton component="a" href={`${API.defaults.baseURL}/tasks/${task._id}/file`}>
                    <DownloadIcon />
                  </IconButton>
                )}
                <IconButton color="primary" onClick={() => { setEditingTask(task); setOpenForm(true); }}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(task._id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <TaskFormDialog
      open={openForm}
      onClose={() => setOpenForm(false)}
      onSave={handleSave}
      initialData={editingTask}
    />
  </Container>
);

}
