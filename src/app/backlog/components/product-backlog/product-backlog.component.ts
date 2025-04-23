import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {CommonModule, formatDate} from '@angular/common';
import { TranslateModule } from "@ngx-translate/core";

import { UserStory } from "../../model/user-story.entity";
import { UserStoriesService } from "../../services/user-stories.service";
import { MatIcon } from "@angular/material/icon";

import { Sprint } from "../../model/sprint.entity";
import { SprintService } from "../../services/sprints.service";
import {FormsModule} from "@angular/forms";

import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-product-backlog',
  standalone: true,
  imports: [MatCardModule, MatInputModule, MatFormFieldModule, CommonModule, MatIcon, FormsModule, TranslateModule],
  templateUrl: './product-backlog.component.html',
  styleUrl: './product-backlog.component.css'
})
export class ProductBacklogComponent {
  userStories: Array<UserStory> = [];

  productBacklog: Array<UserStory> = [];
  sprintBacklog: Array<UserStory> = [];
  usersprints: Array<UserStory> = [];

  sprints: Array<Sprint> = [];
  newSprint: Sprint = new Sprint(0, '', '', 'STARTED', new Date(), new Date());

  constructor(private userStoriesService: UserStoriesService,
              private sprintsService: SprintService) {}

  // Cargar todas las historias de usuario
  private getAllUserStories(): void {
    this.userStoriesService.getAll()
      .subscribe((response: any) => {
        this.productBacklog = response.filter((story: UserStory) => story.sprintId == 0);
        this.usersprints = response;
      });
  }

  //cargar los sprints
  private getAllSprints(): void {
    this.sprintsService.getAll()
      .subscribe((response: any) => {
        this.sprints = response;
      });
  }

  // Metodo para crear un nuevo Sprint
  createSprint(): void {
    const formattedSprint = {
      ...this.newSprint,
      startDate: formatDate(this.newSprint.startDate, 'yyyy-MM-ddTHH:mm:ss.SSSZ', 'en-US'),
      endDate: formatDate(this.newSprint.endDate, 'yyyy-MM-ddTHH:mm:ss.SSSZ', 'en-US')
    };

    this.sprintsService.create(this.newSprint).subscribe((sprint: Sprint) => {
      console.log('Sprint creado:', sprint);
      this.sprintBacklog.forEach(userStory => {
        userStory.sprintId = sprint.id;
        const updatedUserStory = {
          title: userStory.title,
          description: userStory.description,
          epicId: userStory.epicId,
          sprintId: sprint.id,
          effort: userStory.effort
        };
        this.userStoriesService.update(userStory.id, updatedUserStory).subscribe(
          (updatedUserStory: UserStory) => {
            console.log('User story actualizada:', updatedUserStory);
          },
          (error) => {
            console.error('Error al actualizar la user story:', error);
          }
        );
      });
    this.resetSprintForm(); // Restablecer el formulario después de crear el sprint
      this.getAllSprints();
    }, (error) => {
      console.error('Error al crear el sprint:', error);
    });
  }

  // Metodo para restablecer el formulario
  private resetSprintForm(): void {
    this.newSprint = new Sprint(0, '', '', 'STARTED', new Date(), new Date());
  }


  // Mover historia de sprintBacklog a productBacklog
  onDeleteUserStory(element: UserStory) {
    // Eliminar del sprintBacklog
    this.sprintBacklog = this.sprintBacklog.filter((userStory: UserStory) => userStory.id !== element.id);
    // Agregar al productBacklog
    this.productBacklog.push(element);
  }

  // Mover historia de productBacklog a sprintBacklog
  onAddUserStory(element: UserStory) {
    // Eliminar del productBacklog
    this.productBacklog = this.productBacklog.filter((userStory: UserStory) => userStory.id !== element.id);
    // Agregar al sprintBacklog
    this.sprintBacklog.push(element);
  }


  closeSprint(sprint: Sprint) {
    sprint.status = 'FINISHED';
    const formattedSprint = {
      ...sprint,
      startDate: formatDate(sprint.startDate, 'yyyy-MM-ddTHH:mm:ss.SSSZ', 'en-US'),
      endDate: formatDate(sprint.endDate, 'yyyy-MM-ddTHH:mm:ss.SSSZ', 'en-US')
    };
    this.sprintsService.update(sprint.id, sprint).subscribe(
      (updatedSprint: Sprint) => {
        console.log('Sprint actualizado:', updatedSprint);
        this.sprintBacklog.forEach(userStory => {
          if (userStory.sprintId === sprint.id) {
            userStory.status = "DONE";
            const updatedUserStory = {
              ...userStory,
              status: "DONE"
            };
            this.userStoriesService.update(userStory.id, updatedUserStory).subscribe(
              (updatedUserStory: UserStory) => {
                console.log('User story actualizada:', updatedUserStory);
              },
              (error) => {
                console.error('Error al actualizar la user story:', error);
              }
            );
          }
        });
        this.sprintBacklog = this.sprintBacklog.filter(userStory => userStory.sprintId !== sprint.id);
      },
      (error) => {
        console.error('Error al actualizar el sprint:', error);
      }
    );
  }

  isSprintActive(): boolean {
    if (this.sprints.find(sprint => sprint.status === 'STARTED')) {
      return true;
    }
    return false;
  }


  ngOnInit(): void {
    this.getAllUserStories();
    this.getAllSprints();
  }
}
