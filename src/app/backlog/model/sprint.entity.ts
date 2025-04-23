export class Sprint {
  id: number;
  title: string;
  goal: string;
  status: 'STARTED' | 'FINISHED';
  startDate: Date;
  endDate: Date;

  constructor(
    id: number,
    title: string,
    goal: string,
    status: 'STARTED' | 'FINISHED' = 'STARTED',
    startDate: Date,
    endDate: Date
  ) {
    this.id = id;
    this.title = title;
    this.goal = goal;
    this.status = status;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
