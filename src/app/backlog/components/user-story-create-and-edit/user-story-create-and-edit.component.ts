import { Component,Inject } from '@angular/core';
import { MatDialog,MatDialogRef, MAT_DIALOG_DATA,MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, NgForm } from "@angular/forms";
import { NgClass, NgFor } from "@angular/common";
import {ChangeDetectionStrategy} from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import {UserStoriesService} from "../../services/user-stories.service";
import {UserStory} from "../../model/user-story.entity";

import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import {AuthenticationService} from "../../../iam/services/authentication.service";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-story-create-and-edit',
  standalone: true,
  imports: [MatCardModule, FormsModule, NgFor,MatFormFieldModule, MatInputModule, MatSelectModule, TranslateModule],
  templateUrl: './user-story-create-and-edit.component.html',
  styleUrl: './user-story-create-and-edit.component.css'
})
export class UserStoryCreateAndEditComponent {
  newUserStory: UserStory;


  constructor(
    private userStoriesService: UserStoriesService,
    private dialog: MatDialog,  // Para abrir el diálogo de añadir evento
    private dialogRef: MatDialogRef<UserStoryCreateAndEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserStory,
    private authService: AuthenticationService,
    private snackBar: MatSnackBar

) {
    this.newUserStory = data ? { ...data } : new UserStory();
  }

  onSubmit(): void {
    this.authService.currentUserId.subscribe((userId: number) => {
      if (this.newUserStory.id) {
        this.userStoriesService.update(this.newUserStory.id, this.newUserStory).subscribe({
          next: () => {
            this.snackBar.open('Historia de usuario actualizada exitosamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['snackbar-success'],
              verticalPosition: 'top'
            });
            this.dialogRef.close(true);
          },
          error: () => {
            this.snackBar.open('Error al actualizar la historia de usuario', 'Cerrar', {
              duration: 3000,
              panelClass: ['snackbar-error'],
              verticalPosition: 'top'
            });
          }
        });
      } else {
        this.userStoriesService.create(userId, this.newUserStory).subscribe({
          next: () => {
            this.snackBar.open('Historia de usuario creada exitosamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['snackbar-success'],
              verticalPosition: 'top'
            });
            this.dialogRef.close(true);
          },
          error: () => {
            this.snackBar.open('Error al crear la historia de usuario', 'Cerrar', {
              duration: 3000,
              panelClass: ['snackbar-error'],
              verticalPosition: 'top'
            });
          }
        });
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
