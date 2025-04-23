import { Component, Input } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';
import { Statistics } from '../../model/statistic-entity/statistic.entity';

@Component({
  selector: 'app-user-story',
  templateUrl: './user-story.component.html',
  styleUrls: ['./user-story.component.css']
})
export class UserStoryComponent {
  @Input() story!: Statistics; // Usar el operador de aserción no nula, asegurando que siempre haya un valor

  constructor(private statisticsService: StatisticsService) {}

  // Método para actualizar el esfuerzo
  updateEffort(newEffort: number) {
    if (!isNaN(newEffort)) {
      this.statisticsService.updateEffortEstimation(this.story.id, newEffort).subscribe(response => {
        console.log('Effort updated', response);
      });
    }
  }

  // Método para actualizar las fechas
  updateDates(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      this.statisticsService.updateDateRange(this.story.id, start, end).subscribe(response => {
        console.log('Dates updated', response);
      });
    }
  }

  // Método para obtener el valor del input
  getValue(event: Event): string {
    const target = event.target as HTMLInputElement; // Asegúrate de que sea un HTMLInputElement
    return target.value; // Obtener el valor
  }
}
