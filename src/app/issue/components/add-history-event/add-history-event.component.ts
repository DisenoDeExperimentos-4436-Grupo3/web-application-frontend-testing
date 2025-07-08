import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { History } from '../../model/history.entity';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, NgForm } from "@angular/forms";
import { NgClass, NgFor } from "@angular/common";
import { ChangeDetectionStrategy } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-history-event',
  standalone: true,
  imports: [MatCardModule, FormsModule, NgFor, MatFormFieldModule, MatInputModule, MatSelectModule,TranslateModule],
  templateUrl: './add-history-event.component.html',
  styleUrls: ['./add-history-event.component.css']
})
export class AddHistoryEventComponent {
  newHistory: History = new History();

  constructor(private dialogRef: MatDialogRef<AddHistoryEventComponent>,
              private snackBar: MatSnackBar) {
    this.newHistory.createdDate = new Date().toISOString().split('T')[0];  // Fecha automática
  }

  onSubmit(): void {
    if (this.newHistory.createdDate && this.newHistory.madeBy && this.newHistory.eventName && this.newHistory.description) {
      this.snackBar.open('Evento de historial creado exitosamente', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-success'],
        verticalPosition: 'top'
      });
      this.dialogRef.close(this.newHistory);
    } else {
      this.snackBar.open('Por favor completa todos los campos', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-error'],
        verticalPosition: 'top'
      });
      console.error('Faltan datos en el nuevo evento de historial');
    }
  }

  onCancel(): void {
    this.snackBar.open('Creación de evento cancelada', 'Cerrar', {
      duration: 2000,
      panelClass: ['snackbar-info'],
      verticalPosition: 'top'
    });
    this.dialogRef.close(null);
  }
}
