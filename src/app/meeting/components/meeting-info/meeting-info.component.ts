import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Meeting } from '../../model/meeting.entity';
import { Member } from '../../model/member.entity'; // Cambiar a Member
import { MemberService } from '../../services/member.service'; // Cambiar a MemberService
import { EditMemberDialogComponent } from '../participants/edit-participant-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-meeting-info',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,TranslateModule
  ],
  templateUrl: './meeting-info.component.html',
  styleUrls: ['./meeting-info.component.css']
})
export class MeetingInfoComponent implements OnInit {
  @Input() meeting: any;
  members: Member[] = []; // Inicializa como un array vacío

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Meeting,
    private dialogRef: MatDialogRef<MeetingInfoComponent>,
    private memberService: MemberService, // Cambiar a MemberService
    private dialog: MatDialog // Inyectar MatDialog
  ) {
    this.meeting = data;
  }

  async ngOnInit() {
    this.members = await this.memberService.getAll().toPromise() || [];
  }

  getMemberNames(): string[] { // Cambiar a getMemberNames
    return this.meeting.members.map((id: number) => { // Cambiar a members
      const member = this.members.find(m => m.id === id); // Cambiar a member
      return member ? `${member.profile.fullName} ` : 'Unknown'; // Cambiar a profile
    });
  }

  getMemberName(id: number): string { // Cambiar a getMemberName
    const member = this.members.find(m => m.id === id); // Cambiar a member
    return member ? `${member.profile.fullName} ` : 'Unknown'; // Cambiar a profile
  }

  onClose(): void {
    this.dialogRef.close(this.members); // Cerrar el diálogo con la lista actualizada de miembros
  }

  copyLink(): void {
    const link = this.meeting.link;
    navigator.clipboard.writeText(link).then(() => {
      console.log('Link copied to clipboard');
    }).catch(err => {
      console.error('Could not copy link: ', err);
    });
  }

  openEditDialog(): void {
    const dialogRef = this.dialog.open(EditMemberDialogComponent, { // Cambiar a EditMemberDialogComponent
      data: {
        members: this.members, // Cambiar a members
        meetingMembers: this.meeting.members, // Cambiar a members
        meeting: this.meeting // Pasa la reunión completa
      }
    });

    dialogRef.afterClosed().subscribe((result: Member[]) => { // Cambiar a Member
      if (result) {
        this.members = result; // Actualiza la lista de miembros
        this.meeting.members = result.map(m => m.id); // Actualiza los IDs de los miembros en la reunión

        // Guarda los cambios en el db.json
        this.memberService.updateMembers(this.members).subscribe(() => { // Cambiar a updateMembers
          console.log('Members updated in the database');
        });
      }
    });
  }
}
