// issue-form.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Issue } from '../../model/issue.entity';
import { History } from '../../model/history.entity';
import { IssuesService } from '../../services/issues.service';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from "@angular/forms";
import { NgClass, NgFor } from "@angular/common";
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddHistoryEventComponent } from '../add-history-event/add-history-event.component';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import {AuthenticationService} from "../../../iam/services/authentication.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import {SprintService} from "../../../backlog/services/sprints.service";
import {MembersService} from "../../../members/services/members.service";




@Component({
  selector: 'app-issue-form',
  standalone: true,
  imports: [MatCardModule, FormsModule, NgFor, MatFormFieldModule, MatInputModule, MatSelectModule,TranslateModule],
  templateUrl: './issue-form.component.html',
  styleUrls: ['./issue-form.component.css']
})
export class IssueFormComponent {
  newIssue: Issue;
  newHistory: History = new History();
  sprintNames: string[];
  memberNames: string[];

  constructor(
    private issuesService: IssuesService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<IssueFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Issue,

    private sprintsService: SprintService,
    private membersService: MembersService,
    private snackBar: MatSnackBar,


  private authService: AuthenticationService
  ) {
    this.newIssue = data ? { ...data } : new Issue();
    this.sprintNames = [];
    this.memberNames = [];
  }


  ngOnInit(): void {
    this.loadSprintsAndMembers();
  }

  private loadSprintsAndMembers(): void {
    this.authService.currentUserId.subscribe((userId: number) => {
      // Obtener nombres de sprints
      this.sprintsService.getSprintByUserId(userId).subscribe((sprints: any[]) => {
        this.sprintNames = sprints.map(sprint => sprint.title);
      });

      // Obtener nombres de miembros
      this.membersService.getMembersByUserId(userId).subscribe((members: any[]) => {
        this.memberNames = members.map(member => member.fullName);
      });
    });
  }

  onSubmit(): void {
    this.authService.currentUserId.subscribe((userId: number) => {
      function getFormattedDateTime(): string {
        return new Date().toLocaleString('es-PE', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });
      }

      const currentDateTime = getFormattedDateTime();

      if (!this.newIssue.sprintAssociate) {
        console.error('Sprint title is required');
        alert('Por favor, ingresa un título de Sprint antes de enviar el formulario.');
        return;
      }

      if (!this.newIssue.id) {
        // Crear el issue por primera vez
        this.newIssue.createdIn = currentDateTime;

        // Creación de los eventos de historial
        const creationHistory = new History();
        creationHistory.createdDate = currentDateTime;
        creationHistory.eventName = 'Creación';
        creationHistory.madeBy = this.newIssue.madeBy;
        creationHistory.description = `Issue creado por ${this.newIssue.madeBy}`;

        const assignmentHistory = new History();
        assignmentHistory.createdDate = currentDateTime;
        assignmentHistory.eventName = `Asignado a ${this.newIssue.assignedTo}`;
        assignmentHistory.madeBy = this.newIssue.madeBy;
        assignmentHistory.description = `El issue fue asignado a ${this.newIssue.assignedTo}`;

        // Crear el issue y después añadir los eventos de historial
        this.issuesService.createIssue(userId, this.newIssue).subscribe(
          (createdIssue) => {
            this.newIssue = createdIssue;

            this.snackBar.open('Issue creado exitosamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['snackbar-success'],
              verticalPosition: 'top'
            });

            // Añadir eventos de historial usando el issueId
            this.issuesService.addHistoryEventToIssue(this.newIssue.id, creationHistory).subscribe();
            this.issuesService.addHistoryEventToIssue(this.newIssue.id, assignmentHistory).subscribe();

            this.dialogRef.close(createdIssue);
          },
          (error) => {
            this.snackBar.open('Error al crear el Issue', 'Cerrar', {
              duration: 3000,
              panelClass: ['snackbar-error'],
              verticalPosition: 'top'
            });
            console.error('Error al crear el Issue:', error);
          }
        );
      } else {
        // Si el issue ya existe, simplemente lo actualizamos
        this.issuesService.update(this.newIssue.id, this.newIssue).subscribe(
          () => {
            this.snackBar.open('Issue actualizado exitosamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['snackbar-success'],
              verticalPosition: 'top'
            });
            this.dialogRef.close(this.newIssue);
          },
          (error) => {
            this.snackBar.open('Error al actualizar el Issue', 'Cerrar', {
              duration: 3000,
              panelClass: ['snackbar-error'],
              verticalPosition: 'top'
            });
            console.error('Error al actualizar el Issue:', error);
          }
        );
      }
    });
  }

    onCancel(): void {
      this.dialogRef.close(null);
    }

  addHistoryEvent(): void {
    const dialogRef = this.dialog.open(AddHistoryEventComponent, { width: '400px' });
    dialogRef.afterClosed().subscribe((result: History) => {
      if (result) {
        // Genera el próximo ID automáticamente basado en el historial actual
        const maxId = this.newIssue.history.length > 0
          ? Math.max(...this.newIssue.history.map(h => h.id))
          : 0;
        result.id = maxId + 1;

        // Agrega el nuevo evento de historial al backend si el issue ya existe
        if (this.newIssue.id) {
          this.issuesService.addHistoryEventToIssue(this.newIssue.id, result).subscribe(() => {
            console.log('Historial actualizado y guardado correctamente.');
          });
        } else {
          // Si el issue no existe, crea el issue primero
          this.authService.currentUserId.subscribe((userId: number) => {
            this.issuesService.createIssue(userId, this.newIssue).subscribe((createdIssue) => {
              this.newIssue = createdIssue;
              this.issuesService.addHistoryEventToIssue(this.newIssue.id, result).subscribe(() => {
                console.log('Nuevo issue creado y evento de historial guardado correctamente.');
              });
            });
          });
        }
      }
    });
  }
}
