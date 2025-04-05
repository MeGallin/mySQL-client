import axios, { AxiosError } from 'axios';
import { Task, TaskFilters, TaskResponse, TaskListResponse } from '../types';

export const taskService = {
  // Get all tasks with optional filters
  getTasks: async (params: TaskFilters = {}) => {
    try {
      const response = await axios.get<TaskListResponse>('/tasks', { params });
      return response.data;
    } catch (err) {
      const errorMessage =
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
        'Failed to fetch tasks';
      console.error('Get tasks error:', err);
      throw new Error(errorMessage);
    }
  },

  // Get a single task by ID
  getTask: async (id: number) => {
    try {
      const response = await axios.get<TaskResponse>(`/tasks/${id}`);
      return response.data;
    } catch (err) {
      const errorMessage =
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
        'Failed to fetch task';
      console.error('Get task error:', err);
      throw new Error(errorMessage);
    }
  },

  // Create a new task
  createTask: async (taskData: Partial<Task>) => {
    try {
      const response = await axios.post<TaskResponse>('/tasks', taskData);
      return response.data;
    } catch (err) {
      const errorMessage =
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
        'Failed to create task';
      console.error('Create task error:', err);
      throw new Error(errorMessage);
    }
  },

  // Update an existing task
  updateTask: async (id: number, taskData: Partial<Task>) => {
    try {
      const response = await axios.put<TaskResponse>(`/tasks/${id}`, taskData);
      return response.data;
    } catch (err) {
      const errorMessage =
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
        'Failed to update task';
      console.error('Update task error:', err);
      throw new Error(errorMessage);
    }
  },

  // Delete a task
  deleteTask: async (id: number) => {
    try {
      const response = await axios.delete<{ status: string; message: string }>(
        `/tasks/${id}`,
      );
      return response.data;
    } catch (err) {
      const errorMessage =
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
        'Failed to delete task';
      console.error('Delete task error:', err);
      throw new Error(errorMessage);
    }
  },

  // Update task completion status
  toggleTaskCompletion: async (id: number, completed: boolean) => {
    try {
      const response = await axios.put<TaskResponse>(`/tasks/${id}`, {
        completed,
      });
      return response.data;
    } catch (err) {
      const errorMessage =
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
        'Failed to update task completion status';
      console.error('Toggle task completion error:', err);
      throw new Error(errorMessage);
    }
  },

  // Get tasks with filters and sorting
  getFilteredTasks: async ({
    completed,
    priority,
    search,
    sortBy = 'createdAt',
    order = 'DESC',
    page = 1,
    limit = 10,
  }: TaskFilters = {}) => {
    const params = {
      completed,
      priority,
      search,
      sortBy,
      order,
      page,
      limit,
    };

    // Remove undefined values
    Object.keys(params).forEach(
      (key) =>
        params[key as keyof typeof params] === undefined &&
        delete params[key as keyof typeof params],
    );

    try {
      const response = await axios.get<TaskListResponse>('/tasks', { params });
      return response.data;
    } catch (err) {
      const errorMessage =
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
        'Failed to fetch filtered tasks';
      console.error('Get filtered tasks error:', err);
      throw new Error(errorMessage);
    }
  },
};
