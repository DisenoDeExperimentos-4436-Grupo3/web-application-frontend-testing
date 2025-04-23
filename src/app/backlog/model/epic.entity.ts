export class Epic {
  id: number;
  title: string;
  description: string;
  status:  'TO_DO' | 'IN_PROGRESS' | 'DONE';

  constructor(
    id: number,
    title: string,
    description: string,
    status:  'TO_DO' | 'IN_PROGRESS' | 'DONE' = 'TO_DO',
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
  }
}
