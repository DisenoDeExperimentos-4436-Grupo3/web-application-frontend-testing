export class Sprint {
  id: number;
  startDate: Date;
  endDate: Date;

  constructor(id: number, startDate: Date, endDate: Date) {
    this.id = id;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
