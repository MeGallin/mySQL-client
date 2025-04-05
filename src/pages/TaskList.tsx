import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Pagination,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { taskService } from '../services/taskService';
import TaskDialog from '../components/TaskDialog';
import { Task, TaskFilters } from '../types';

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    completed: '',
    priority: '',
    sortBy: 'createdAt',
    order: 'DESC',
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getFilteredTasks({
        ...filters,
        page,
        limit: 10,
      });
      setTasks(response.data.tasks);
      setTotalPages(response.data.pagination.totalPages);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, filters]);

  const handleFilterChange = (field: keyof TaskFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1); // Reset to first page when filters change
  };

  const handleToggleComplete = async (taskId: number, completed: boolean) => {
    try {
      await taskService.toggleTaskCompletion(taskId, !completed);
      fetchTasks();
    } catch (err) {
      console.error('Failed to toggle task completion:', err);
    }
  };

  const handleDelete = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        fetchTasks();
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  const handleDialogClose = (success: boolean) => {
    setEditTask(null);
    if (success) {
      fetchTasks();
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

  if (loading && !tasks.length) {
    return <Typography>Loading tasks...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Search"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              endAdornment: <SearchIcon />,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            select
            fullWidth
            label="Status"
            value={filters.completed}
            onChange={(e) => handleFilterChange('completed', e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="true">Completed</MenuItem>
            <MenuItem value="false">Active</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            select
            fullWidth
            label="Priority"
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            select
            fullWidth
            label="Sort By"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <MenuItem value="createdAt">Created Date</MenuItem>
            <MenuItem value="dueDate">Due Date</MenuItem>
            <MenuItem value="priority">Priority</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            select
            fullWidth
            label="Order"
            value={filters.order}
            onChange={(e) =>
              handleFilterChange('order', e.target.value as 'ASC' | 'DESC')
            }
          >
            <MenuItem value="ASC">Ascending</MenuItem>
            <MenuItem value="DESC">Descending</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Paper>
        <List>
          {tasks.map((task) => (
            <ListItem
              key={task.id}
              divider
              sx={{
                bgcolor: task.completed ? 'action.hover' : 'inherit',
              }}
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task.id, task.completed)}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="subtitle1"
                    sx={{
                      textDecoration: task.completed ? 'line-through' : 'none',
                    }}
                  >
                    {task.title}
                  </Typography>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    {task.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {task.description}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        size="small"
                        label={task.priority}
                        color={getPriorityColor(task.priority)}
                      />
                      {task.dueDate && (
                        <Chip
                          size="small"
                          label={`Due: ${format(
                            new Date(task.dueDate),
                            'MMM d, yyyy',
                          )}`}
                        />
                      )}
                    </Box>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <Tooltip title="Edit">
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => setEditTask(task)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(task.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      {totalPages > 1 && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      <TaskDialog
        open={!!editTask}
        onClose={handleDialogClose}
        task={editTask}
      />
    </Box>
  );
};

export default TaskList;
