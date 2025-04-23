import { Component, OnInit } from '@angular/core'; // Importar componentes básicos de Angular
import { IssuesService } from '../../services/issues.service'; // Servicio que maneja las operaciones relacionadas con los "issues"
import { Issue } from '../../model/issue.entity'; // Modelo de datos para los "issues"
import { MatDialog } from '@angular/material/dialog'; // Servicio de Angular Material para manejar diálogos
import { IssueFormComponent } from '../../components/issue-form/issue-form.component'; // Componente para el formulario de crear/editar "issues"
import { IssueDetailsComponent } from '../../components/issue-details/issue-details.component'; // Componente para mostrar los detalles del "issue"
import { AddHistoryEventComponent } from '../../components/add-history-event/add-history-event.component'; // Componente para añadir eventos al historial
import { MatCardModule } from '@angular/material/card'; // Módulo para tarjetas de Angular Material
import { FormsModule } from '@angular/forms'; // Módulo para formularios
import { NgClass, NgFor } from '@angular/common'; // Directivas comunes de Angular
import { History } from '../../model/history.entity'; // Modelo de datos para eventos de historial
import { MatSelectModule } from '@angular/material/select'; // Módulo de selectores de Angular Material
import { MatInputModule } from '@angular/material/input'; // Módulo de inputs de Angular Material
import { MatFormFieldModule } from '@angular/material/form-field'; // Módulo para campos de formularios de Angular Material
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-issues-list', // Selector del componente
  standalone: true, // Indica que es un componente autónomo (standalone)
  imports: [MatCardModule, FormsModule, NgFor, MatFormFieldModule, MatInputModule, MatSelectModule,TranslateModule], // Módulos importados que el componente usará
  templateUrl: './issues-list.component.html', // Ruta de la plantilla HTML del componente
  styleUrls: ['./issues-list.component.css'] // Ruta de la hoja de estilos del componente
})
export class IssuesListComponent implements OnInit {
  issues: Issue[] = []; // Arreglo para almacenar la lista de "issues"
  filteredIssues: Issue[] = []; // Arreglo para almacenar los "issues" filtrados


  // Listas de sprints y prioridades disponibles
  sprints: string[] = ['SPRINT 1', 'SPRINT 2','SPRINT 3', 'SPRINT 4'];
  priorities: string[] = ['LOW', 'MEDIUM', 'HIGH'];

  // Variables para los filtros seleccionados
  selectedSprint: string | null = null;
  selectedPriority: string | null = null;

  // Inyección de dependencias: el servicio de "issues" y el servicio de diálogos
  constructor(private issuesService: IssuesService, private dialog: MatDialog) {}

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.loadIssues(); // Carga los "issues" al iniciar el componente
  }

  // Cargar todos los "issues" desde el servicio
  loadIssues(): void {
    this.issuesService.getAllIssues().subscribe((data: Issue[]) => {
      this.issues = data; // Asigna los "issues" obtenidos
      this.filteredIssues = data; // Inicialmente, todos los "issues" están filtrados
    });
  }

  // Filtrar "issues" según los criterios seleccionados (sprint y prioridad)
  filterIssues(): void {
    this.filteredIssues = this.issues.filter(issue => {
      return (!this.selectedSprint || issue.sprintAssociate === this.selectedSprint) && // Filtrar por sprint si está seleccionado
             (!this.selectedPriority || issue.priority === this.selectedPriority); // Filtrar por prioridad si está seleccionada
    });
  }

  // Abrir un diálogo para añadir un nuevo "issue"
  openAddIssueForm(): void {
    const dialogRef = this.dialog.open(IssueFormComponent, {
      width: '400px' // Tamaño del diálogo
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.issues.push(result); // Añadir el nuevo "issue" sin recargar la página
      }
    });
  }

  // Abrir un diálogo para ver más detalles de un "issue"
  openViewMore(issue: Issue): void {
    this.dialog.open(IssueDetailsComponent, {
      width: '600px', // Tamaño del diálogo
      data: issue // Pasar el "issue" como dato al componente de detalles
    });
  }

  // Abrir un diálogo para editar un "issue"
  openEditIssueForm(issue: Issue): void {
    const dialogRef = this.dialog.open(IssueFormComponent, {
      width: '400px', // Tamaño del diálogo
      data: issue // Pasar el "issue" como dato al formulario
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.issues.findIndex(i => i.id === result.id); // Buscar el índice del "issue" editado
        if (index !== -1) {
          this.issues[index] = result; // Actualizar el "issue" en la lista
        }
      }
    });
  }

  // Eliminar un "issue"
  deleteIssue(issue: Issue): void {
    if (confirm('¿Estás seguro de que deseas eliminar este issue?')) { // Confirmar antes de eliminar
      this.issuesService.delete(issue.id).subscribe(() => {
        this.issues = this.issues.filter(i => i.id !== issue.id); // Eliminar el "issue" de la lista
        this.loadIssues();
      });
    }
  }


  // Abrir un diálogo para añadir un evento al historial de un "issue"
  addHistoryEvent(issue: Issue): void {
      const dialogRef = this.dialog.open(AddHistoryEventComponent, {
        width: '400px'
      });

      dialogRef.afterClosed().subscribe((result: History) => {
        if (result) {
          result.createdDate = new Date().toLocaleString('es-PE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          });

          // Llama al nuevo método en IssuesService para añadir el evento de historial usando el issueId
          this.issuesService.addHistoryEventToIssue(issue.id, result).subscribe(
            () => {
              console.log('Evento de historial añadido correctamente.');
              this.loadIssues(); // Opcional: actualizar la lista de issues después de añadir el evento
            },
            (error) => {
              console.error('Error al añadir el evento de historial:', error);
            }
          );
        }
      });
    }
}
