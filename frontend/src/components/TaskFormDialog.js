import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid
} from "@mui/material";

export default function TaskFormDialog({ open, onClose, onSave, initialData }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setDeadline(initialData.deadline ? initialData.deadline.slice(0, 10) : "");
      setFile(null);
    } else {
      setTitle(""); setDescription(""); setDeadline(""); setFile(null);
    }
  }, [initialData, open]);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("deadline", deadline);
    if (file) formData.append("file", file);
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? "Edit Task" : "Add Task"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Description" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={3} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth type="date" label="Deadline" InputLabelProps={{ shrink: true }} value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" component="label">
              Upload PDF
              <input type="file" accept="application/pdf" hidden onChange={(e) => setFile(e.target.files[0])} />
            </Button>
            {file && <span style={{ marginLeft: 8 }}>{file.name}</span>}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>{initialData ? "Save" : "Create"}</Button>
      </DialogActions>
    </Dialog>
  );
}
