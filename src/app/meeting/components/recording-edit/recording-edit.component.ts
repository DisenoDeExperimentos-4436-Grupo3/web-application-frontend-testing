import { Component, EventEmitter, inject, Inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field"; // MatFormFieldModule en lugar de MatFormField
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon"; // MatIconModule en lugar de MatIcon
import {
  MAT_DIALOG_DATA,
  MatDialogModule, // Importar MatDialogModule en lugar de directivas sueltas
  MatDialogRef
} from "@angular/material/dialog";
import { TranslateModule } from "@ngx-translate/core";
import { MatSelectModule } from "@angular/material/select"; // Solo MatSelectModule
import { Meeting } from "../../model/meeting.entity";
import { MeetingService } from "../../services/meeting.service";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // Necesario para el datepicker
import { NgxMaterialTimepickerComponent } from 'ngx-material-timepicker'; // Asegúrate de importar el componente correcto
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-recording-edit',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule, // Cambiado a MatIconModule
    MatDialogModule, // Importar MatDialogModule
    NgxMaterialTimepickerModule,
    MatInputModule,
    MatFormFieldModule, // Cambiado a MatFormFieldModule
    FormsModule,
    TranslateModule,
    MatSelectModule, // Solo MatSelectModule
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './recording-edit.component.html',
  styleUrls: ['./recording-edit.component.css'] // Corregido a styleUrls
})
export class RecordingEditComponent implements OnInit {
  // Attributes
  meeting: Meeting;

  editMode!: boolean;
  inputData: any;
  @ViewChild('resourceForm', {static: false}) resourceForm!: NgForm;
  @ViewChild('pickerTime') pickerTime!: NgxMaterialTimepickerComponent; // Cambiado a NgxMaterialTimepickerComponent

  private meetingService: MeetingService = inject(MeetingService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<RecordingEditComponent>) {
    this.meeting = data.meeting;
    this.editMode = data.editMode;
  }

  onTimeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const timeValue = input.value; // Obtiene el valor de la hora

    // Validar el formato de la hora (ejemplo: "12:35 AM")
    const timePattern = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
    if (timePattern.test(timeValue)) {
      // La hora es válida, puedes procesar el valor
      console.log('Hora válida:', timeValue);
    } else {
      // La hora no es válida, puedes mostrar un mensaje de error
      console.error('Hora no válida. Usa el formato hh:mm AM/PM');
    }
  }
validateTime(event: Event) {
  const input = event.target as HTMLInputElement;
  const timeValue = input.value; // Obtiene el valor de la hora

  // Validar el formato de la hora (ejemplo: "12:35 AM")
  const timePattern = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;

  if (!timePattern.test(timeValue) && timeValue !== '') {
    // Si la hora no es válida y el campo no está vacío, limpia el campo
    input.value = '';
    alert('Por favor, ingresa una hora válida en el formato hh:mm AM/PM.');
  }
}


formatDate(): void {
    const dateParts = this.meeting.dateStr.split('/');
    if (dateParts.length === 3) {
      this.meeting.dateStr = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    }
  }

  // CRUD Actions
  private createResource(): void {
    this.meetingService.create(this.meeting).subscribe(response => {
      this.meeting = response;
      // Aquí puedes agregar lógica para añadir la grabación si es necesario
      // Por ejemplo:
      this.addRecording(this.meeting);
    });
  }

  private addRecording(meeting: Meeting): void {
    const recording = {
      title: meeting.title,
      dateStr: meeting.dateStr,
      timeStr: meeting.timeStr,
      link: meeting.link,
      recordingLink: meeting.recording.recordingLink,
              duration: meeting.recording.duration,
              publicAccess: meeting.recording.publicAccess
    };
    // Lógica para añadir el recording a tu data source de recordings
    // Esto dependerá de cómo estés gestionando tus grabaciones
  }

  private updateResource(): void {
    let resourceToUpdate: Meeting = this.meeting;
    this.meetingService.update(this.meeting.id, resourceToUpdate)
      .subscribe(response => {
        this.meeting = response;
      });
  };

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
    this.dialogRef.close()
  }
  ngOnInit(): void {
    this.inputData = this.data;
  }

}
