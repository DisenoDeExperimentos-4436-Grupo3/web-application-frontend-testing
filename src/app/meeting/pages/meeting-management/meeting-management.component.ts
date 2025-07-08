import { Component, inject, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { NgClass } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MeetingCreateAndEditComponent } from '../../components/meeting-create-and-edit/meeting-create-and-edit.component';
import { Meeting } from '../../model/meeting.entity';
import { MeetingService } from '../../services/meeting.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MeetingInfoComponent } from '../../components/meeting-info/meeting-info.component';
import { MemberService } from '../../services/member.service';
import { AuthenticationService } from "../../../iam/services/authentication.service";
import { ChangeDetectorRef } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-meeting-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    TranslateModule
  ],
  templateUrl: './meeting-management.component.html',
  styleUrls: ['./meeting-management.component.css']
})
export class MeetingManagementComponent implements OnInit {
  // Attributes
  meetingData: Meeting;
  meeting!: Array<Meeting>;
  isEditMode: boolean;

  private matDialog: MatDialog = inject(MatDialog);

  // Constructor
  constructor(
    private meetingService: MeetingService,
    private authService: AuthenticationService,
    private cdr: ChangeDetectorRef, // Inyección del servicio ChangeDetectorRef
    private snackBar: MatSnackBar
  ) {
    this.isEditMode = false;
    this.meetingData = {} as Meeting;
    this.meeting = [];
  }

  // Private Methods
  private resetEditState(): void {
    this.isEditMode = false;
    this.meetingData = {} as Meeting;
  }

  // get all by hostId (userId)
  private getAllResources(): void {
    this.authService.currentUserId.subscribe((userId: number) => {
      this.meetingService.getByUserId(userId)
        .subscribe((response: any) => {
          this.meeting = response.map((item: Meeting) => {
            return {
              ...item,
              dateStr: this.parseDate(item.dateStr) // Convertir dateStr a objeto Date
            };
          });
          this.cdr.detectChanges(); // Forzar la detección de cambios
        });
    });
  }

  private parseDate(dateStr: string): Date | null {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  }

  private createResource(): void {
    this.authService.currentUserId.subscribe((userId: number) => {
      this.meetingService.create(userId, this.meetingData)
        .subscribe({
          next: (response) => {
            this.meeting = [...this.meeting, { ...response }];
            this.cdr.detectChanges();
            this.snackBar.open('Reunión creada exitosamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['snackbar-success'],
              verticalPosition: 'top'
            });
          },
          error: () => {
            this.snackBar.open('Error al crear la reunión', 'Cerrar', {
              duration: 3000,
              panelClass: ['snackbar-error'],
              verticalPosition: 'top'
            });
          }
        });
    });
  }

  private updateResource(): void {
    let resourceToUpdate: Meeting = this.meetingData;
    this.meetingService.update(this.meetingData.id, resourceToUpdate)
      .subscribe({
        next: (response) => {
          this.meeting = this.meeting.map(resource =>
            resource.id === response.id ? response : resource
          );
          this.cdr.detectChanges();
          this.snackBar.open('Reunión actualizada exitosamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-success'],
            verticalPosition: 'top'
          });
        },
        error: () => {
          this.snackBar.open('Error al actualizar la reunión', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-error'],
            verticalPosition: 'top'
          });
        }
      });
  }

  private deleteResource(id: number): void {
    this.meetingService.delete(id)
      .subscribe({
        next: () => {
          this.meeting = this.meeting.filter(m => m.id !== id);
          this.cdr.detectChanges();
          this.snackBar.open('Reunión eliminada exitosamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-success'],
            verticalPosition: 'top'
          });
        },
        error: () => {
          this.snackBar.open('Error al eliminar la reunión', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-error'],
            verticalPosition: 'top'
          });
        }
      });
  }

  // UI Event Handlers
  onEditItem(element: Meeting) {
    this.isEditMode = true;
    this.meetingData = element;
    this.onOpenDialog();
  }

  onAddItem() {
    this.isEditMode = false;
    this.meetingData = {} as Meeting;
    this.onOpenDialog();
  }

  onDeleteItem(element: Meeting) {
    this.deleteResource(element.id);
  }

  onOpenDialog() {
    const dialogRef = this.matDialog.open(MeetingCreateAndEditComponent, {
      width: '500px',
      height: '400px',
      data: { meeting: this.meetingData, editMode: this.isEditMode }
    });

    // Esperar a que el diálogo se cierre antes de recargar los datos
    dialogRef.afterClosed().subscribe(result => {
      if (result) { // Verifica si se devolvió un resultado válido
        this.getAllResources(); // Recargar la lista de reuniones desde la base de datos
      }
    });
  }

  // Método para abrir un enlace
  openLink(url: string): void {
    window.open(url, '_blank');
  }

  // Lifecycle Hooks
  ngOnInit(): void {
    this.getAllResources();
  }

  onViewItem(element: Meeting): void {
    const dialogRef = this.matDialog.open(MeetingInfoComponent, {
      width: '400px',
      data: element
    });

    dialogRef.afterClosed().subscribe(() => {
      // Aquí puedes manejar cualquier acción después de cerrar el diálogo si es necesario
    });
  }
}
