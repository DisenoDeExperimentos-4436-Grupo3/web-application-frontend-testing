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
import {MatOption, MatSelect} from "@angular/material/select";
import {AuthenticationService} from "../../../iam/services/authentication.service";
import { MatSnackBar } from '@angular/material/snack-bar';

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
    CommonModule,
    MatSelect,
    MatOption,
    // Asegúrate de incluir CommonModule
  ]
})
export class MemberCreateAndEditComponent implements OnInit {
  newMember: Member = new Member();
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private membersService: MembersService,
    private dialogRef: MatDialogRef<MemberCreateAndEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Member,
    private authService: AuthenticationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.newMember = { ...this.data };
    }

  }

  // Método para enviar los datos (crear o editar)
  onSubmit(): void {
    this.isLoading = true;
    this.authService.currentUserId.subscribe((userId: number) => {
      if (this.newMember.id) {
        // Lógica de actualización
        this.membersService.update(this.newMember.id, this.newMember).subscribe({
          next: (updatedMember) => {
            this.isLoading = false;
            this.snackBar.open('Miembro actualizado exitosamente', 'Cerrar', {
              duration: 3000,
              panelClass: 'snackbar-success',
              verticalPosition: 'top'
            });
            this.dialogRef.close(updatedMember);
          },
          error: (err: any) => {
            this.isLoading = false;
            this.errorMessage = `Error al actualizar el miembro: ${err.message || 'No se pudo actualizar el miembro'}`;
            this.snackBar.open('Error al actualizar el miembro', 'Cerrar', {
              duration: 3000,
              panelClass: 'snackbar-error',
              verticalPosition: 'top'
            });
          }
        });
      } else {
        // Lógica de creación
        this.membersService.create(userId, this.newMember).subscribe({
          next: (createdMember) => {
            this.isLoading = false;
            this.snackBar.open('Miembro creado exitosamente', 'Cerrar', {
              duration: 3000,
              panelClass: 'snackbar-success',
              verticalPosition: 'top'
            });
            this.dialogRef.close(createdMember);
          },
          error: (err: any) => {
            this.isLoading = false;
            this.errorMessage = `Error al crear el miembro: ${err.message || 'No se pudo crear el miembro'}`;
            this.snackBar.open('Error al crear el miembro', 'Cerrar', {
              duration: 3000,
              panelClass: 'snackbar-error',
              verticalPosition: 'top'
            });
          }
        });
      }
    });
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
          this.snackBar.open('Miembro eliminado exitosamente', 'Cerrar', {
            duration: 3000,
            panelClass: 'snackbar-success',
            verticalPosition: 'top'
          });
          this.dialogRef.close({ deleted: true, memberId: this.newMember.id });
        },
        error: (err: any) => {
          this.isLoading = false;
          this.errorMessage = `Error al eliminar el miembro: ${err.message || 'No se pudo eliminar el miembro'}`;
          this.snackBar.open('Error al eliminar el miembro', 'Cerrar', {
            duration: 3000,
            panelClass: 'snackbar-error',
            verticalPosition: 'top'
          });
        }
      });
    }
  }
}
