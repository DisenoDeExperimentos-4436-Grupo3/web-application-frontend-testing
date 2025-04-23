export class PersonName {
  fullName: string;


  constructor(fullName: string) {
    this.fullName = fullName;

  }

  getFullName(): string {
    return `${this.fullName}`;
  }
}
