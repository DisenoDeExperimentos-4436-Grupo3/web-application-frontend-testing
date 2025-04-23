import { v4 as uuidv4 } from 'uuid';
import { Component, EventEmitter, inject, Inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from "@angular/material/dialog";
import { TranslateModule } from "@ngx-translate/core";
import { MatSelectModule } from "@angular/material/select";
import { Meeting } from "../../model/meeting.entity";
import { MeetingService } from "../../services/meeting.service";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MemberService } from '../../services/member.service'; // Servicio para obtener miembros

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-meeting-create-and-edit',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    NgxMaterialTimepickerModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    TranslateModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './meeting-create-and-edit.component.html',
  styleUrls: ['./meeting-create-and-edit.component.css']
})
export class MeetingCreateAndEditComponent implements OnInit {
  meeting: Meeting;
  editMode!: boolean;
  inputData: any;
  members: any[] = []; // Lista de miembros
  @ViewChild('resourceForm', { static: false }) resourceForm!: NgForm;
  //@ViewChild('pickerTime') pickerTime!: NgxMaterialTimepickerComponent;

  private meetingService: MeetingService = inject(MeetingService);
  private memberService: MemberService = inject(MemberService); // Servicio inyectado

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<MeetingCreateAndEditComponent>) {
    this.meeting = data.meeting;
    this.editMode = data.editMode;
  }

  onTimeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const timeValue = input.value; // Obtiene el valor de la hora

    // Validar el formato de la hora (ejemplo: "13:00")
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (timePattern.test(timeValue)) {
      // La hora es válida, puedes procesar el valor
      console.log('Hora válida:', timeValue);
    } else {
      // La hora no es válida, puedes mostrar un mensaje de error
      console.error('Hora no válida. Usa el formato HH:mm');
    }
  }

  validateTime(event: Event) {
    const input = event.target as HTMLInputElement;
    const timeValue = input.value; // Obtiene el valor de la hora

    // Validar el formato de la hora (ejemplo: "13:00")
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!timePattern.test(timeValue) && timeValue !== '') {
      // Si la hora no es válida y el campo no está vacío, limpia el campo
      input.value = '';
      alert('Por favor, ingresa una hora válida en el formato HH:mm.');
    }
  }

  formatDate(): void {
    const dateStr = this.meeting.dateStr as any;

    if (dateStr instanceof Date && !isNaN(dateStr.getTime())) {
      this.meeting.dateStr = dateStr.toISOString().split('T')[0];
    } else if (typeof dateStr === 'string' && dateStr.trim() !== '') {
      const dateParts = dateStr.split('/');
      if (dateParts.length === 3) {
        this.meeting.dateStr = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      }
    }
  }



  // CRUD Actions
private createResource(): void {
  const dateStr = new Date(this.meeting.dateStr);
  const formattedDate = dateStr.toISOString().split('T')[0]; // "YYYY-MM-DD"
  const formattedTime = this.meeting.timeStr; // Asumiendo que ya está en formato "HH:MM"

  this.meeting.dateStr = formattedDate;
  this.meeting.timeStr = formattedTime;

  this.meeting.members = this.members.map(m => m.id);
  this.meeting.accessCode = uuidv4(); // Genera UUID para el código de acceso

  const randomHost = this.selectRandomHost();
  if (randomHost) {
    console.log('Host seleccionado:', randomHost);
    this.meeting.host = randomHost.id;
  }
  this.meeting.link = this.generateRandomLink();

  this.meeting.recording = {
    recordingLink: this.generateRecordingLink(),
    duration: this.generateRandomDuration(),
    publicAccess: this.generateRandomAccess()
  };

  this.meetingService.create(this.meeting).subscribe(response => {
    this.meeting = response; // Asegúrate de asignar la respuesta completa, incluyendo el código de acceso
    this.addRecording(this.meeting);
  });
}

  private updateResource(): void {
    let resourceToUpdate: Meeting = this.meeting;

    this.meetingService.update(this.meeting.id, resourceToUpdate).subscribe(response => {
      this.meeting = response;
    });
  }

  private addRecording(meeting: Meeting): void {
    const recording = {
      title: meeting.title,
      dateStr: meeting.dateStr,
      timeStr: meeting.timeStr,
      link: meeting.link,
      recordingLink: meeting.recording.recordingLink,
      duration: this.generateRandomDuration(),
      publicAccess: this.generateRandomAccess()
    };

    // Lógica para añadir el recording a tu data source de recordings
  }

  private generateRandomLink(): string {
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `https://meet.google.com/${randomPart}`;
  }

  private generateRecordingLink(): string {
    return `https://meet.google.com/recordings/${this.meeting.title.replace(/\s+/g, '-').toLowerCase()}`;
  }

  private generateRandomDuration(): string {
    const hours = Math.floor(Math.random() * 2);
    const minutes = Math.floor(Math.random() * 60);
    return `${hours}h ${minutes}m`;
  }

  private generateRandomAccess(): boolean {
    return Math.random() < 0.5;
  }

  private loadMembers(): void {
    this.memberService.getAll().subscribe((members) => {
      this.members = members;
    });
  }

  private generateAccessCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  private selectRandomHost(): any {
    if (this.members.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.members.length);
      return this.members[randomIndex];
    }
    return null;
  }

  // UI Event Handlers
  onSubmit(): void {
    if (this.resourceForm.form.valid) {
      if (this.editMode) {
        this.updateResource();
      } else {
        this.createResource();
      }
      this.onClose();
    } else {
      console.error('Invalid data in form');
    }
  }

  onCancel(): void {
    console.log('Submit');
  }

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.inputData = this.data;
    this.loadMembers(); // Cargar miembros al inicializar el componente
  }
}

