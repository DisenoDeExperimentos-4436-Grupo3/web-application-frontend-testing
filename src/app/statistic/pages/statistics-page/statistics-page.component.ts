import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexYAxis } from 'ng-apexcharts';
import { RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { StatisticsChartComponent } from '../../components/statistics-chart/statistics-chart.component';
import { TranslateModule } from '@ngx-translate/core';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
};

@Component({
  standalone: true,
  selector: 'app-statistics-page',
  templateUrl: './statistics-page.component.html',
  styleUrls: ['./statistics-page.component.css'],
  imports: [CommonModule, RouterModule, NgApexchartsModule, StatisticsChartComponent, TranslateModule],
})
export class StatisticsPageComponent implements OnInit {
  public chartOptions: Partial<ChartOptions>;
  public members: any[] = [];
  public userStories: any[] = [];
  public sprints: any[] = [];
  public isLoadingStories: boolean = true;
  public isLoadingMembers: boolean = true;
  public errorMessage: string | null = null;

  constructor(private statisticsService: StatisticsService) {
    this.chartOptions = {
      series: [],
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: true,
      },
      yaxis: {
        min: 0,
        max: 10,
        tickAmount: 10,
        labels: {
          formatter: (val) => `${val}`,
        },
      },
    };
  }

  ngOnInit(): void {
    this.loadUserStories();
    this.loadMembers();
    this.loadSprints();
  }

  private loadUserStories(): void {
    this.statisticsService.loadUserStories().subscribe({
      next: (userStories) => {
        console.log('User Stories cargadas:', userStories);

        // Asegúrate de que los Sprints están cargados correctamente
        this.statisticsService.getSprints().subscribe({
          next: (sprints) => {
            console.log('Sprints cargados:', sprints);

            // Asocia los sprints completos a las historias de usuario
            userStories = userStories.map((story) => {
              const sprint = sprints.find((sprint) => sprint.id === story.sprintId);  // Busca el Sprint correcto
              return {
                ...story,
                sprint: sprint || null,  // Asocia el objeto Sprint completo
              };
            });

            console.log('User Stories con Sprints:', userStories);

            // Filtrar los sprints únicos desde las user stories
            const sprintsIds = Array.from(new Set(userStories.map((story) => story.sprint?.id)));
            console.log('Sprints encontrados:', sprintsIds);

            // Crear la serie de datos para el gráfico
            const seriesData = sprintsIds.map((sprintId) => {
              const sprintData = userStories.filter((story) => story.sprint?.id === sprintId);

              console.log(`Historias de usuario para Sprint ${sprintId}:`, sprintData);

              // Resumir los datos por estado
              const inProgress = sprintData.filter((story) => story.status === 'TO_DO').length;
              const complete = sprintData.filter((story) => story.status === 'DONE').length;

              return {
                sprint: sprintId ? `Sprint ${sprintId}` : 'Desconocido',  // Asegurándote de que 'sprint' no sea undefined
                inProgress,
                complete,
              };
            });

            console.log('Datos para el gráfico:', seriesData);

            // Configurar las opciones del gráfico
            this.chartOptions = {
              series: [
                {
                  name: 'TO_DO',
                  data: seriesData.map((data) => ({
                    x: data.sprint,
                    y: data.inProgress,
                  })),
                },
                {
                  name: 'DONE',
                  data: seriesData.map((data) => ({
                    x: data.sprint,
                    y: data.complete,
                  })),
                },
              ],
            };
          },
          error: (err) => {
            console.error('Error al cargar los Sprints:', err);
          },
        });
      },
      error: (err) => {
        console.error('Error al cargar las historias de usuario:', err);
      },
    });
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
        this.errorMessage = 'Error al cargar miembros';
        console.error('Error al cargar miembros:', error);
      },
    });
  }

  private loadSprints(): void {
    this.statisticsService.getSprints().subscribe({
      next: (sprints) => {
        console.log('Sprints cargados:', sprints);
        this.sprints = sprints;
      },
      error: (error) => {
        console.error('Error al cargar sprints:', error);
      },
    });
  }
}
