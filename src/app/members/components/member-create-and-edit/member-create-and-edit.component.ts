import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MembersService } from '../../services/members.service';
import { Member } from '../../model/member.entity';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-member-create-and-edit',
  templateUrl: './member-create-and-edit.component.html',
  styleUrls: ['./member-create-and-edit.component.css'],
  standalone: true,
  imports: [
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CommonModule // Asegúrate de incluir CommonModule
  ]
})
export class MemberCreateAndEditComponent implements OnInit {
  newMember: Member = new Member();
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private membersService: MembersService,
    private dialogRef: MatDialogRef<MemberCreateAndEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Member
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.newMember = { ...this.data };
    }

  }

  // Método para enviar los datos (crear o editar)
  onSubmit(): void {
    this.isLoading = true;
    if (this.newMember.id) {
      // Lógica de actualización
      this.membersService.update(this.newMember.id, this.newMember).subscribe({
        next: (updatedMember) => {
          this.isLoading = false;
          this.dialogRef.close(updatedMember); // Retornamos el miembro actualizado
        },
        error: (err: any) => {
          this.isLoading = false;
          this.errorMessage = `Error al actualizar el miembro: ${err.message || 'No se pudo actualizar el miembro'}`;
          console.error('Error al actualizar el miembro:', err);
        }
      });
    } else {
      // Lógica de creación
      this.membersService.create(this.newMember).subscribe({
        next: (createdMember) => {
          this.isLoading = false;
          this.dialogRef.close(createdMember); // Retornamos el miembro creado
        },
        error: (err: any) => {
          this.isLoading = false;
          this.errorMessage = `Error al crear el miembro: ${err.message || 'No se pudo crear el miembro'}`;
          console.error('Error al crear el miembro:', err);
        }
      });
    }
  }

  // Método para cancelar la acción
  onCancel(): void {
    this.dialogRef.close(false);
  }

  // Método para eliminar un miembro
  onDelete(): void {
    if (this.newMember.id) {
      this.isLoading = true;
      this.membersService.delete(this.newMember.id).subscribe({
        next: () => {
          this.isLoading = false;
          this.dialogRef.close({ deleted: true, memberId: this.newMember.id }); // Indicamos que el miembro fue eliminado
        },
        error: (err: any) => {
          this.isLoading = false;
          this.errorMessage = `Error al eliminar el miembro: ${err.message || 'No se pudo eliminar el miembro'}`;
          console.error('Error al eliminar el miembro:', err);
        }
      });
    }
  }
}
