// statistics-table.component.ts
import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../services/statistics.service';
import { Statistics } from '../model/statistic-entity/statistics.entity'; // Importar la clase Statistics
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-statistics-table',
  templateUrl: './statistics-table.component.html',
    imports: [TranslateModule],
  styleUrls: ['./statistics-table.component.css']
})
export class StatisticsTableComponent implements OnInit {
  userStories: Statistics[] = []; // Usar el modelo Statistics

  constructor(private statisticsService: StatisticsService, private translate: TranslateService) {
    this.translate.setDefaultLang('en');
        this.translate.use('en'); // O 'in'
        }

  ngOnInit(): void {
    this.statisticsService.getUserStories().subscribe(data => {
      this.userStories = data.map(item => new Statistics(
        item.id,
        item.title,
        item.description,
        item.owner,
        item.status
      ));
    });
  }
}
