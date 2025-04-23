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
import { RecordingManagementComponent } from '../../components/recording-management/recording-management.component';
import { MemberService } from '../../services/member.service'; // Cambiado a MemberService


@Component({
  selector: 'app-meeting-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MeetingCreateAndEditComponent,
    MeetingInfoComponent,
    NgClass,
    TranslateModule,RecordingManagementComponent
  ],
  templateUrl: './meeting-management.component.html',
  styleUrls: ['./meeting-management.component.css']
})
export class MeetingManagementComponent implements OnInit {
  // Attributes
  meetingData: Meeting;
  meeting!: Array<Meeting>;
  isEditMode: boolean;

  private meetingService: MeetingService = inject(MeetingService);
  private matDialog: MatDialog = inject(MatDialog);

  // Constructor
  constructor() {
    this.isEditMode = false;
    this.meetingData = {} as Meeting;
    this.meeting = [];
  }

  // Private Methods
  private resetEditState(): void {
    this.isEditMode = false;
    this.meetingData = {} as Meeting;
  }

  // CRUD Actions
  private getAllResources(): void {
    this.meetingService.getAll()
      .subscribe((response: any) => {
        this.meeting = response.map((item: Meeting) => {
          return {
            ...item,
            dateStr: this.parseDate(item.dateStr)  // Convertir dateStr a objeto Date
          };
        });
      });
  }

  private parseDate(dateStr: string): Date | null {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  }

  private createResource(): void {
    this.meetingService.create(this.meetingData)
      .subscribe(response => {
        this.meeting.push({ ...response });
      });
  };

  private updateResource(): void {
    let resourceToUpdate: Meeting = this.meetingData;
    this.meetingService.update(this.meetingData.id, resourceToUpdate)
      .subscribe(response => {
        this.meeting = this.meeting.map(resource => {
          if (resource.id === response.id) {
            return response;
          }
          return resource;
        });
      });
  };

  private deleteResource(id: number): void {
    this.meetingService.delete(id)
      .subscribe(() => {
        this.meeting = this.meeting.filter(meeting => {
          return meeting.id !== id;
        });
      });
  };

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
    const _matdialog = this.matDialog.open(MeetingCreateAndEditComponent, {
      width: '500px',
      height: '400px',
      data: { meeting: this.meetingData, editMode: this.isEditMode }
    });
    _matdialog.afterClosed().subscribe(() => {
      this.getAllResources();
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
