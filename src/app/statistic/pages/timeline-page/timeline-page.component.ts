import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';
import { Sprint } from '../../model/statistic-entity/sprint.entity';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'app-timeline-page',
  templateUrl: './timeline-page.component.html',
  styleUrls: ['./timeline-page.component.css'],
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, TranslateModule]
})
export class TimelinePageComponent implements OnInit, AfterViewInit {
  @ViewChild("chart") chart!: ChartComponent;
  sprints: Sprint[] = [];
  userStories: any[] = [];
  chartOptions: any = {};
    public isLoadingMembers: boolean = true;

    public members: any[] = [];


  private sprintColors: { [key: number]: string } = {
    1: '#FF5733',
    2: '#33FF57',
    3: '#3357FF',
    4: '#F33FFF',
  };

  constructor(
    private statisticsService: StatisticsService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit() {
    this.initializeChartOptions();
    this.loadSprints();
    this.loadUserStories();
        this.loadMembers();

  }

  ngAfterViewInit() {
    // Verifica si el gráfico ya está cargado y si la serie ya está disponible
    if (this.chartOptions.series.length > 0) {
      this.initializeChart();
    }
  }

  initializeChartOptions() {
    this.chartOptions = {
      series: [],
      chart: {
        height: 350,
        type: "rangeBar",
        toolbar: { show: true }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '100%',
        }
      },
      xaxis: {
        type: 'datetime',
        labels: { format: 'dd MMM' },
      },
      yaxis: {
        labels: { style: { fontSize: '12px' } }
      },
      legend: { show: false },
    };
  }

  loadSprints() {
    this.statisticsService.getSprints().subscribe({
      next: (sprints) => {
        console.log('Sprints cargados:', sprints);
        this.sprints = sprints;
        if (this.sprints.length > 0) {
          this.updateChartSeries();
        } else {
          console.error('No se encontraron sprints.');
        }
      },
      error: (error) => console.error('Error al cargar sprints:', error)
    });
  }

  loadUserStories() {
    this.statisticsService.getUserStories().subscribe({
      next: (stories) => {
        console.log('User Stories cargadas:', stories);
        this.userStories = stories;
      },
      error: (error) => console.error('Error al cargar user stories:', error)
    });
  }

  initializeChart() {
    if (this.chart) {
      this.chart.updateOptions(this.chartOptions);
    } else {
      console.error('El elemento del gráfico no está inicializado.');
    }
  }

  updateChartSeries() {
    const seriesData = this.sprints.map(sprint => {
      return {
        name: `Sprint ${sprint.id}`,
        data: [
          {
            x: `Sprint ${sprint.id}`,
            y: [
              new Date(sprint.startDate).getTime(),
              new Date(sprint.endDate).getTime()
            ],
            fillColor: this.getColorBySprint(sprint.id)
          }
        ]
      };
    });

    this.chartOptions.series = seriesData;

    if (this.chart) {
      this.chart.updateOptions(this.chartOptions);
    } else {
      console.warn("Gráfico no disponible en el momento de la actualización, esperando ngAfterViewInit.");
    }
  }

  getColorBySprint(sprintId: number): string {
    return this.sprintColors[sprintId] || 'white';
  }

  navigateToStatistics() {
    this.router.navigate(['/statistics']);
  }
private loadMembers(): void {
    this.statisticsService.getMembers().subscribe({
      next: (members) => {
        console.log('Members cargados:', members);
        this.members = members;
        this.isLoadingMembers = false;
      },
      error: (error) => {
        this.isLoadingMembers = false;
        console.error('Error al cargar miembros:', error);
      },
    });
  }
}
