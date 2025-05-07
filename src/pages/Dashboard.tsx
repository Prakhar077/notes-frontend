import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Typography, TextField, Button, List, ListItem, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const [note, setNote] = useState({ title: '', content: '', id: null });

  const { data: notes = [] } = useQuery(['notes'], async () => {
    const res = await API.get('/notes');
    return res.data;
  });

  const createNote = useMutation(
    (data) => API.post('/notes', data),
    { onSuccess: () => queryClient.invalidateQueries(['notes']) }
  );

  const updateNote = useMutation(
    ({ id, ...data }) => API.put(`/notes/${id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['notes']);
        setNote({ title: '', content: '', id: null });
      }
    }
  );

  const deleteNote = useMutation(
    (id) => API.delete(`/notes/${id}`),
    { onSuccess: () => queryClient.invalidateQueries(['notes']) }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (note.id) {
      updateNote.mutate(note);
    } else {
      createNote.mutate({ title: note.title, content: note.content });
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Button onClick={logout} color="error" sx={{ mb: 2 }}>Logout</Button>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth label="Title" value={note.title}
          onChange={(e) => setNote({ ...note, title: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth label="Content" multiline rows={3}
          value={note.content}
          onChange={(e) => setNote({ ...note, content: e.target.value })}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" fullWidth>
          {note.id ? 'Update Note' : 'Add Note'}
        </Button>
      </form>
      <List>
        {notes.map((n) => (
          <ListItem key={n.id} secondaryAction={
            <>
              <IconButton onClick={() => setNote(n)}><Edit /></IconButton>
              <IconButton onClick={() => deleteNote.mutate(n.id)}><Delete /></IconButton>
            </>
          }>
            <Box>
              <Typography variant="subtitle1">{n.title}</Typography>
              <Typography variant="body2">{n.content}</Typography>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Dashboard;