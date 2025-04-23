export class Statistics {
  id: number;
  title: string;
  description: string;
  owner: string;
  status: 'TO_DO' | 'DONE'; // Define explícitamente los posibles valores de estado
  sprint: number; // Representa el ID del sprint asociado
  effort: number; // Representa el esfuerzo asociado a la historia

  constructor(
    id: number,
    title: string,
    description: string,
    owner: string,
    status: 'TO_DO' | 'DONE',
    sprint: number,
    effort: number
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.owner = owner;
    this.status = status;
    this.sprint = sprint;
    this.effort = effort;
  }
}
