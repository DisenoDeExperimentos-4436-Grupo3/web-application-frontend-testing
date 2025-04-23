import { Task } from './task.entity';

export class UserStory {
  id: number;
  title: string;
  description: string;
  epicId: number; // Vinculación de la User Story con una Epic
  sprintId: number | null; // Cambiado a sprintBacklogId
  effort: number;
  status: 'TO_DO' | 'IN_PROGRESS' | 'DONE'; // Cambié los estados para que coincidan con el JSON
  tasks: Task[]; // Array de tareas

  constructor(
    id: number = 0,
    title: string = '',
    description: string = '',
    epicId: number = 0,
    sprintId: number | null = null,
    effort: number = 0,
    status: 'TO_DO' | 'IN_PROGRESS' | 'DONE' = 'TO_DO',
    tasks: Task[] = [] // Inicializa tasks como un array vacío
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.epicId = epicId;
    this.sprintId = sprintId;
    this.effort = effort;
    this.status = status;
    this.tasks = tasks; // Inicializa tasks
  }
}
