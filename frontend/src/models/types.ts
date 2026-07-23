export interface User {
  id: number;
  username: string;
  email?: string;
  role?: string;
}

export interface Tag {
  id?: number;
  title: string;
  color: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  orderIndex: number;
  creationDate: string;
  dueDate: string;
  priority: string;
  assignedUser?: User;
  tags?: Tag[];
  board?: { id: number };
}

export interface Board {
  id: number;
  title: string;
  orderIndex: number;
  tasks: Task[];
}

export interface Project {
  id: number;
  name: string;
  owner?: User;
  members?: User[];
  boards: Board[];
}
