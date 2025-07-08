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
import {AuthenticationService} from "../../../iam/services/authentication.service";
import { MatSnackBar } from '@angular/material/snack-bar';

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


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<MeetingCreateAndEditComponent>,
              private authService:AuthenticationService,
              private snackBar: MatSnackBar) {
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

  this.authService.currentUserId.subscribe((userId: number) => {
    this.meetingService.create(userId, this.meeting).subscribe({
      next: (response) => {
        this.meeting = response;
        this.snackBar.open('Reunión creada exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success'],
          verticalPosition: 'top'
        });
      },
      error: () => {
        this.snackBar.open('Ocurrió un error al guardar la reunión', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-error'],
          verticalPosition: 'top'
        });
      }
    });
  });
}

  private updateResource(): void {
    let resourceToUpdate: Meeting = this.meeting;

    this.meetingService.update(this.meeting.id, resourceToUpdate).subscribe({
      next: (response) => {
        this.meeting = response;
        this.snackBar.open('Reunión actualizada exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success'],
          verticalPosition: 'top'
        });
      },
      error: () => {
        this.snackBar.open('Ocurrió un error al actualizar la reunión', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-error'],
          verticalPosition: 'top'
        });
      }
    });
  }

  private loadMembers(): void {
    this.memberService.getAll().subscribe((members) => {
      this.members = members;
    });
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
    this.dialogRef.close(this.meeting); // Devuelve el objeto `meeting` creado o actualizado
  }

  ngOnInit(): void {
    this.inputData = this.data;
    this.loadMembers(); // Cargar miembros al inicializar el componente
  }
}

