import { Component, OnInit } from '@angular/core';
import { Chart, registerables, TooltipItem } from 'chart.js';
import { StatisticsService } from '../../services/statistics.service';
import { Statistics } from '../../model/statistic-entity/statistic.entity';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';

Chart.register(...registerables);

@Component({
  selector: 'app-statistics-chart',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './statistics-chart.component.html',
  styleUrls: ['./statistics-chart.component.css']
})
export class StatisticsChartComponent implements OnInit {
  public chart: any;
  public sprints: any[] = [];  // Array for storing sprints

  constructor(
    private statisticsService: StatisticsService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
    this.translate.use('en'); // or 'in'
  }

  ngOnInit(): void {
    this.fetchStatistics();
  }

  fetchStatistics() {
    // Fetch sprints from the API
    this.statisticsService.getSprints().subscribe((sprints) => {
      this.sprints = sprints;  // Assign the sprints to the array

      // Fetch user stories from the API
      this.statisticsService.getUserStories().subscribe((statistics: Statistics[]) => {
        console.log(statistics);  // Verify the response of the user stories

        const sprintCounts: { [key: number]: { complete: number; inProgress: number; total: number; titlesComplete: { title: string; owner: string }[]; titlesInProgress: { title: string; owner: string }[] } } = {};

        // Initialize sprintCounts object based on dynamic sprints
        this.sprints.forEach(sprint => {
          sprintCounts[sprint.id] = { complete: 0, inProgress: 0, total: 0, titlesComplete: [], titlesInProgress: [] };
        });

        // Process user stories and update sprintCounts
        statistics.forEach(stat => {
          console.log(stat.status);  // Verify the values of 'status'

          // Check if the status and sprint are valid before proceeding
          if (stat.status && sprintCounts[stat.sprint]) {
            if (stat.status === 'DONE') {
              sprintCounts[stat.sprint].complete++;
              sprintCounts[stat.sprint].titlesComplete.push({ title: stat.title, owner: stat.owner });
            } else if (stat.status === 'TO_DO') {
              sprintCounts[stat.sprint].inProgress++;
              sprintCounts[stat.sprint].titlesInProgress.push({ title: stat.title, owner: stat.owner });
            }
            sprintCounts[stat.sprint].total++;
          }
        });

        // Create the chart with the sprint counts
        this.createChart(sprintCounts);
      });
    });
  }

  createChart(sprintCounts: { [key: number]: { complete: number; inProgress: number; total: number; titlesComplete: { title: string; owner: string }[]; titlesInProgress: { title: string; owner: string }[] } }) {
    const ctx = document.getElementById('myStatisticChart') as HTMLCanvasElement;

    // Generate dynamic labels and percentages based on available sprints
    const labels = this.sprints.map(sprint => `Sprint ${sprint.id}`);
    const completePercentages = this.sprints.map(sprint => {
      const count = sprintCounts[sprint.id];
      return count ? (count.total ? (count.complete / count.total) * 100 : 0) : 0;
    });

    const inProgressPercentages = this.sprints.map(sprint => {
      const count = sprintCounts[sprint.id];
      return count ? (count.total ? (count.inProgress / count.total) * 100 : 0) : 0;
    });

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,  // Use dynamic labels from sprints
        datasets: [
          {
            label: 'Completed Stories (%)',
            data: completePercentages,
            backgroundColor: 'rgba(0, 255, 0, 0.5)' // Green
          },
          {
            label: 'Stories In Progress (%)',
            data: inProgressPercentages,
            backgroundColor: 'rgba(255, 0, 0, 0.5)' // Red
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value) => value + '%',
              stepSize: 10
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: (tooltipItems) => {
                const sprintIndex = tooltipItems[0].dataIndex;
                return `Sprint ${this.sprints[sprintIndex].id}`;
              },
              label: (tooltipItem: TooltipItem<'bar'>) => {
                const datasetLabel = tooltipItem.dataset.label || '';
                const value = tooltipItem.raw as number;
                return `${datasetLabel}: ${value.toFixed(2)}%`;
              },
              afterLabel: (tooltipItem: TooltipItem<'bar'>) => {
                const sprintIndex = tooltipItem.dataIndex;
                const sprintData = sprintCounts[this.sprints[sprintIndex].id];

                // Determine if it's the "Completed" or "In Progress" dataset
                let titles: { title: string; owner: string }[] = [];
                if (tooltipItem.datasetIndex === 0) { // "Completed" dataset
                  titles = sprintData.titlesComplete;
                } else { // "In Progress" dataset
                  titles = sprintData.titlesInProgress;
                }

                // Build the additional information string
                const additionalInfo = titles.map((titleInfo) => {
                  return `Title: ${titleInfo.title}, Owner: ${titleInfo.owner}`;
                }).join('\n');

                return additionalInfo || 'No titles'; // Show relevant stories or a default message
              }
            }
          }
        }
      }
    });
  }

  // Method to handle click on timeline button
  viewTimeline() {
    this.router.navigate(['/timeline']); // Redirect to the Timeline route
  }

  // Method to download the chart as a PNG image
  downloadChart() {
    const canvas = document.getElementById('myStatisticChart') as HTMLCanvasElement;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'statistics_chart.png';
    link.click();
  }
}
