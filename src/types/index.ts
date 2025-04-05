export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  status: string;
  data: {
    user: User;
    accessToken: string;
  };
}

export interface TaskResponse {
  status: string;
  data: {
    task: Task;
  };
}

export interface TaskListResponse {
  status: string;
  data: {
    tasks: Task[];
    pagination: {
      total: number;
      page: number;
      totalPages: number;
    };
  };
}

export interface TaskFilters {
  search?: string;
  completed?: string;
  priority?: string;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<User>;
  logout: () => Promise<void>;
  setError: (error: string | null) => void;
}

export interface TaskDialogProps {
  open: boolean;
  onClose: (success: boolean) => void;
  task?: Task | null;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
}
