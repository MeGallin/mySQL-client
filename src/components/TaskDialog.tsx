import { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DatePicker } from '@mui/x-date-pickers';
import { taskService } from '../services/taskService';
import { TaskDialogProps, Task } from '../types';

interface TaskFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: Date | null;
}

const schema = yup.object().shape({
  title: yup.string().required('Title is required').min(1).max(255),
  description: yup.string().nullable(),
  priority: yup
    .string()
    .oneOf(['low', 'medium', 'high'], 'Invalid priority')
    .required('Priority is required'),
  dueDate: yup
    .date()
    .transform((value: unknown) => (value instanceof Date ? value : null))
    .nullable(),
});

const TaskDialog = ({ open, onClose, task = null }: TaskDialogProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      dueDate: null,
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
      });
    } else {
      reset({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: null,
      });
    }
  }, [task, reset]);

  const onSubmit = async (data: TaskFormData) => {
    try {
      const formattedData = {
        ...data,
        dueDate: data.dueDate ? data.dueDate.toISOString() : null,
      };

      if (task) {
        await taskService.updateTask(task.id, formattedData);
      } else {
        await taskService.createTask(formattedData);
      }
      onClose(true); // Pass true to indicate successful submission
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Priority"
                  error={!!errors.priority}
                  helperText={errors.priority?.message}
                  fullWidth
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </TextField>
              )}
            />

            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                  label="Due Date"
                  slotProps={{
                    textField: {
                      error: !!errors.dueDate,
                      helperText: errors.dueDate?.message,
                      fullWidth: true,
                    },
                  }}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(false)}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {task ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskDialog;
