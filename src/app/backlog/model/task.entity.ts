export class Task {
  taskId: number;
  title: string;
  description: string;
  status:  'TO_DO' | 'IN_PROGRESS' | 'DONE';
  estimation: number;

  constructor(
    taskId: number = 0,
    title: string = '',
    description: string = '',
    status: 'TO_DO' | 'IN_PROGRESS' | 'DONE' = 'TO_DO',
    estimation: number = 0,

  ) {
    this.taskId = taskId;
    this.title = title;
    this.description = description;
    this.status = status;
    this.estimation = estimation;
  }
}

