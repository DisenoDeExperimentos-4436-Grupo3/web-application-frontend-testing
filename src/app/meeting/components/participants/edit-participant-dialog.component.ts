import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Member } from '../../model/member.entity'; // Cambiado a Member
import { MatDialogModule } from '@angular/material/dialog';
import { Meeting } from '../../model/meeting.entity';
import { MeetingService } from '../../services/meeting.service'; // Asegúrate de ajustar la ruta según tu estructura
import { MemberService } from '../../services/member.service'; // Servicio para obtener miembros
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';

interface EditMemberDialogData { // Cambiado a EditMemberDialogData
  members: Member[]; // Lista de miembros de la reunión
  availableMembers: Member[]; // Lista de miembros disponibles para agregar
  meetingMembers: number[]; // IDs de los miembros en la reunión
  meeting: Meeting; // Detalles de la reunión
}

@Component({
  selector: 'app-edit-member-dialog', // Cambiado a EditMemberDialogComponent
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './edit-participant-dialog.component.html', // Cambia esto
  styleUrls: ['./edit-participant-dialog.component.css']
})
export class EditMemberDialogComponent { // Cambiado a EditMemberDialogComponent
  meeting: Meeting;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EditMemberDialogData,
    private dialogRef: MatDialogRef<EditMemberDialogComponent>, // Cambiado a EditMemberDialogComponent
    private meetingService: MeetingService
  ) {
    this.meeting = data.meeting; // Asigna el meeting aquí
  }

  // En vez de eliminar, simplemente marca el miembro como no en la reunión
  removeMember(member: Member): void { // Cambiado a removeMember
    const index = this.data.meetingMembers.indexOf(member.id);
    if (index >= 0) {
      this.data.meetingMembers.splice(index, 1); // Eliminar del array de miembros en la reunión
    }
  }

  private updateResource(): void {
    let resourceToUpdate: Meeting = this.meeting;

    // Asegúrate de que el host actualizado también se refleje
    this.meetingService.update(this.meeting.id, resourceToUpdate).subscribe(response => {
      this.meeting = response;
    });
  }

  addMember(member: Member): void { // Cambiado a addMember
    // Agregar solo si no está en la reunión
    if (!this.isMemberInMeeting(member)) { // Cambiado a isMemberInMeeting
      this.data.meetingMembers.push(member.id); // Agregar a la lista de miembros en la reunión
    }
  }

  isMemberInMeeting(member: Member): boolean { // Cambiado a isMemberInMeeting
    return this.data.meetingMembers.includes(member.id);
  }

  setHost(member: Member): void { // Cambiado a setHost
    this.meeting.host = member.id; // Asegúrate de que meeting tenga el campo host
  }

  onSave(): void {
    this.dialogRef.close(this.data.meetingMembers); // Cerrar el diálogo y retornar los miembros
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
