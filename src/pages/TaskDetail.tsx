import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Button,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { taskService } from '../services/taskService';
import TaskDialog from '../components/TaskDialog';
import { Task } from '../types';

const TaskDetail = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchTask = async () => {
    if (!taskId) return;

    try {
      setLoading(true);
      const response = await taskService.getTask(parseInt(taskId, 10));
      setTask(response.data.task);
    } catch (err) {
      setError('Failed to fetch task details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const handleDelete = async () => {
    if (!task) return;

    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(task.id);
        navigate('/tasks');
      } catch (err) {
        setError('Failed to delete task');
        console.error(err);
      }
    }
  };

  const handleToggleComplete = async () => {
    if (!task) return;

    try {
      await taskService.toggleTaskCompletion(task.id, !task.completed);
      fetchTask();
    } catch (err) {
      setError('Failed to update task status');
      console.error(err);
    }
  };

  const handleDialogClose = (success: boolean) => {
    setIsEditing(false);
    if (success) {
      fetchTask();
    }
  };

  const getPriorityColor = (
    priority: 'low' | 'medium' | 'high',
  ): 'success' | 'warning' | 'error' | 'default' => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!task) {
    return <Alert severity="info">Task not found</Alert>;
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate('/tasks')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1">
          Task Details
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="h2">
            {task.title}
          </Typography>
          <Box>
            <IconButton onClick={() => setIsEditing(true)} sx={{ mr: 1 }}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <Chip
            label={task.completed ? 'Completed' : 'Active'}
            color={task.completed ? 'success' : 'default'}
            onClick={handleToggleComplete}
          />
          <Chip label={task.priority} color={getPriorityColor(task.priority)} />
          {task.dueDate && (
            <Chip
              label={`Due: ${format(new Date(task.dueDate), 'MMM d, yyyy')}`}
            />
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {task.description ? (
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {task.description}
          </Typography>
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: 'italic' }}
          >
            No description provided
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            color: 'text.secondary',
          }}
        >
          <Typography variant="body2">
            Created: {format(new Date(task.createdAt), 'MMM d, yyyy')}
          </Typography>
          {task.updatedAt !== task.createdAt && (
            <Typography variant="body2">
              Updated: {format(new Date(task.updatedAt), 'MMM d, yyyy')}
            </Typography>
          )}
        </Box>
      </Paper>

      <TaskDialog open={isEditing} onClose={handleDialogClose} task={task} />
    </Box>
  );
};

export default TaskDetail;
