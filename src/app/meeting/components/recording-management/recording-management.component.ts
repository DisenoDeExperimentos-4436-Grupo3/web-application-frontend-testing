import { Component, inject, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MeetingCreateAndEditComponent } from '../../components/meeting-create-and-edit/meeting-create-and-edit.component';
import { Meeting } from '../../model/meeting.entity';
import { MeetingService } from '../../services/meeting.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MeetingInfoComponent } from '../../components/meeting-info/meeting-info.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { RecordingEditComponent } from '../../components/recording-edit/recording-edit.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-recording-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MeetingCreateAndEditComponent,
    MeetingInfoComponent,
    RecordingEditComponent,

    TranslateModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './recording-management.component.html',
  styleUrls: ['./recording-management.component.css']
})
export class RecordingManagementComponent implements OnInit {
  // Atributos
  meetingData: Meeting;
  meeting!: Array<Meeting>; // Lista de reuniones
  filteredMeetings!: Array<Meeting>; // Lista filtrada
  isEditMode: boolean;
  filterValue: string = ''; // Valor para el filtro de búsqueda por nombre
  startDate!: Date | null; // Fecha de inicio para filtro de fechas
  endDate!: Date | null; // Fecha de fin para filtro de fechas

  private meetingService: MeetingService = inject(MeetingService);
  private matDialog: MatDialog = inject(MatDialog);

  constructor() {
    this.isEditMode = false;
    this.meetingData = {} as Meeting;
    this.meeting = [];
    this.filteredMeetings = []; // Inicializa la lista filtrada
  }

  applyFilter(): void {
    const filter = this.filterValue.toLowerCase();
    this.applyDateFilter(); // Aplica el filtro por fechas antes de filtrar por nombre

    this.filteredMeetings = this.filteredMeetings.filter(meetingItem =>
      meetingItem.title.toLowerCase().includes(filter)
    );
  }

  // Filtro por rango de fechas
  applyDateFilter(): void {
    this.filteredMeetings = [...this.meeting]; // Restablece la lista antes de aplicar filtros

    if (this.startDate && this.endDate) {
      this.filteredMeetings = this.filteredMeetings.filter(meetingItem => {
        const meetingDate = new Date(meetingItem.dateStr);
        return meetingDate >= this.startDate! && meetingDate <= this.endDate!;
      });
    }
  }

  // Métodos Privados
  private resetEditState(): void {
    this.isEditMode = false;
    this.meetingData = {} as Meeting;
  }

  // Acciones CRUD
  private getAllResources(): void {
    this.meetingService.getAll().subscribe((response: any) => {
      this.meeting = response;
      this.filteredMeetings = this.meeting; // Inicializa la lista filtrada
    });
  }

  private createResource(): void {
    this.meetingService.create(this.meetingData).subscribe(response => {
      this.meeting.push({ ...response }); // Agregamos el nuevo recurso
      this.filteredMeetings = this.meeting; // Actualizamos la lista filtrada
    });
  }

  private updateResource(): void {
    let resourceToUpdate: Meeting = this.meetingData;
    this.meetingService.update(this.meetingData.id, resourceToUpdate).subscribe(response => {
      this.meeting = this.meeting.map(resource => {
        if (resource.id === response.id) {
          return response;
        }
        return resource;
      });
      this.filteredMeetings = this.meeting; // Actualizamos la lista filtrada
    });
  }

  private deleteResource(id: number): void {
    this.meetingService.delete(id).subscribe(() => {
      this.meeting = this.meeting.filter(meeting => meeting.id !== id); // Filtramos el recurso eliminado
      this.filteredMeetings = this.meeting; // Actualizamos la lista filtrada
    });
  }

  // Controladores de Eventos de UI
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
    const _matdialog = this.matDialog.open(RecordingEditComponent, {
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

  // Método para abrir la sección de grabaciones
  openRecordings(): void {
    window.open('/recordings', '_blank'); // Ajusta la URL según la ruta de tus grabaciones
  }

  // Hooks del Ciclo de Vida
  ngOnInit(): void {
    this.getAllResources();
    // this.getAllSubResources(); // Eliminar o comentar esta línea si no existe el método
  }

  onViewItem(element: Meeting): void {
    const dialogRef = this.matDialog.open(MeetingInfoComponent, {
      width: '400px', // Ajusta el ancho del diálogo según sea necesario
      data: element // Pasa el objeto de la reunión seleccionada al diálogo
    });

    dialogRef.afterClosed().subscribe(() => {
      // Aquí puedes manejar cualquier acción después de cerrar el diálogo si es necesario
    });
  }
}

