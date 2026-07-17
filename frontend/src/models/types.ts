export interface User {
  username: string;
  email: string;
  password?: string;
}

export interface Tag {
  title: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  order: number;
  creationDate: string;
  dueDate: string;
  priority: "Baixa" | "Média" | "Alta" | string;
  tags: Tag[];
  assignees?: User[];
}

export interface Board {
  id: string;
  title: string;
  order: number;
  tasks: Task[];
}

export interface Project {
  id: string;
  name: string;
  boards: Board[];
}
