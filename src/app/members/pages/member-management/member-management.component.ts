import { Component, OnInit } from '@angular/core';
import { MembersService } from "../../services/members.service";
import { Member } from "../../model/member.entity";
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { NgFor } from "@angular/common";
import { MemberCreateAndEditComponent } from "../../components/member-create-and-edit/member-create-and-edit.component";

@Component({
  selector: 'app-member-management',
  standalone: true,
  imports: [MatCardModule, FormsModule, NgFor, TranslateModule],
  templateUrl: './member-management.component.html',
  styleUrls: ['./member-management.component.css']
})
export class MemberManagementComponent implements OnInit {
  members: Member[] = [];

  constructor(private membersService: MembersService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getAllMembers();
  }

  getAllMembers(): void {
    this.membersService.getAllMembers().subscribe((members: Member[]) => {
      console.log(members);  // Log the members data to inspect its structure
      this.members = members;
    });
  }


  // Método para eliminar un miembro
  deleteMember(member: Member): void {
    if (confirm('¿Estás seguro de que deseas sacarlo del proyecto?')) {
      this.membersService.delete(member.id).subscribe({
        next: () => {
          this.members = this.members.filter(m => m.id !== member.id); // Actualizar la lista local después de eliminar
        },
        error: (err: any) => {
          console.error('Error al eliminar el miembro:', err);
        }
      });
    }
  }

  // Método para abrir el diálogo de agregar un nuevo miembro
  openAddMemberDialog(): void {
    const dialogRef = this.dialog.open(MemberCreateAndEditComponent, {
      width: '400px',
      height: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Agregar el nuevo miembro directamente a la lista local
        this.members.push(result);
      }
    });
  }

  // Método para abrir el diálogo de edición de miembro
  openEditMemberDialog(member: Member): void {
    const dialogRef = this.dialog.open(MemberCreateAndEditComponent, {
      width: '400px',
      height: '600px',
      data: member // Pasamos el miembro actual para editar
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Actualizar el miembro editado en la lista local
        const index = this.members.findIndex(m => m.id === result.id);
        if (index !== -1) {
          this.members[index] = result; // Reemplazamos el miembro editado en la lista local
        }
      }
    });
  }
}
