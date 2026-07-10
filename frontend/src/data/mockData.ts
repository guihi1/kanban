import type { Project, User, Tag } from '../models/types';

export const mockUsers: User[] = [
  { username: 'joao.silva', email: 'joao@example.com' },
  { username: 'maria.souza', email: 'maria@example.com' }
];

export const mockTags: Tag[] = [
  { title: 'Frontend', color: 'primary' },
  { title: 'Backend', color: 'success' },
  { title: 'Bug', color: 'danger' },
  { title: 'Design', color: 'warning' }
];

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Desenvolvimento do Kanban',
    boards: [
      {
        id: 'board-1',
        title: 'A Fazer',
        order: 0,
        tasks: [
          {
            id: 'task-1',
            title: 'Configurar React Router',
            description: 'Instalar react-router-dom e criar as rotas principais',
            order: 0,
            creationDate: new Date().toISOString(),
            dueDate: new Date(Date.now() + 86400000).toISOString(),
            priority: 'Alta',
            tags: [mockTags[0]],
            assignees: [mockUsers[0]]
          },
          {
            id: 'task-2',
            title: 'Modelar Dados',
            description: 'Criar as interfaces baseadas no diagrama de classes',
            order: 1,
            creationDate: new Date().toISOString(),
            dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
            priority: 'Média',
            tags: [mockTags[1]],
            assignees: [mockUsers[1]]
          }
        ]
      },
      {
        id: 'board-2',
        title: 'Em Progresso',
        order: 1,
        tasks: [
          {
            id: 'task-3',
            title: 'Configurar ambiente',
            description: 'Rodar npm install e verificar os pacotes',
            order: 0,
            creationDate: new Date().toISOString(),
            dueDate: new Date(Date.now() + 86400000).toISOString(),
            priority: 'Baixa',
            tags: [],
            assignees: [mockUsers[0]]
          }
        ]
      },
      {
        id: 'board-3',
        title: 'Concluído',
        order: 2,
        tasks: []
      }
    ]
  },
  {
    id: 'proj-2',
    name: 'Projeto de Marketing',
    boards: [
      {
        id: 'board-11',
        title: 'Ideias',
        order: 0,
        tasks: [
          {
            id: 'task-101',
            title: 'Campanha de Redes Sociais',
            description: 'Criar posts para o próximo mês',
            order: 0,
            creationDate: new Date().toISOString(),
            dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
            priority: 'Média',
            tags: [mockTags[3]],
            assignees: []
          }
        ]
      },
      {
        id: 'board-12',
        title: 'Revisão',
        order: 1,
        tasks: []
      }
    ]
  }
];
