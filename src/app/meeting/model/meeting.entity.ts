import { Member } from "../model/member.entity"; // Ajusta la ruta según corresponda

export class Meeting {
  id: number;
  title: string;
  dateStr: string;
  timeStr: string;
  link: string;
  recording: {
    recordingLink: string;
    duration: string;
    publicAccess: boolean; // Esta propiedad debe estar aquí
  };
  host: number; // Solo el ID del host

  accessCode: string;
  members: number[]; // Agrega esta línea para incluir la propiedad members

  constructor() {
    this.id = 0;
    this.title = '';
    this.dateStr = '';
    this.timeStr = '';
    this.link = '';
    this.recording = {
      recordingLink: '',
      duration: '',
      publicAccess: false, // Inicializar con un valor predeterminado
    };
    this.host = 0;

    this.accessCode = '';
    this.members = []; // Inicializa members como un array vacío
  }
}
