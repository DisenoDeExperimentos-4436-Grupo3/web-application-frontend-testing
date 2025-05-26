import { Member } from "../model/member.entity"; // Ajusta la ruta según corresponda

export class Meeting {
  id: number;
  title: string;
  dateStr: string;
  timeStr: string;
  link: string;
  accessCode: string;
  host: number; // Solo el ID del host
  members: number[]; // Agrega esta línea para incluir la propiedad members

  constructor() {
    this.id = 0;
    this.title = '';
    this.dateStr = '';
    this.timeStr = '';
    this.link = '';
    this.accessCode = '';
    this.host = 0;
    this.members = []; // Inicializa members como un array vacío
  }
}
