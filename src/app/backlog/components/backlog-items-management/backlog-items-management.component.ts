import { Component } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, NgForm } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { NgClass, NgFor } from "@angular/common";

import { UserStory } from "../../model/user-story.entity";
import { UserStoriesService } from "../../services/user-stories.service";

import { Task } from "../../model/task.entity";
//import { TasksService } from "../../services/tasks.service";

import { Epic } from "../../model/epic.entity";
import { EpicsService } from "../../services/epics.service";
import { MatIcon } from "@angular/material/icon";

import { UserStoryCreateAndEditComponent } from "../user-story-create-and-edit/user-story-create-and-edit.component";
import { TaskCreateAndEditComponent } from "../task-create-and-edit/task-create-and-edit.component"; // Importa el componente para tareas
import { EpicCreateAndEditComponent } from "../epic-create-and-edit/epic-create-and-edit.component";
import {Sprint} from "../../model/sprint.entity"; // Importa el componente para épicos

import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-backlog-items-management',
  standalone: true,
  imports: [MatCardModule, MatInputModule, MatFormFieldModule, CommonModule, FormsModule, MatIcon, NgFor, TranslateModule],
  templateUrl: './backlog-items-management.component.html',
  styleUrl: './backlog-items-management.component.css'
})
export class BacklogItemsManagementComponent {
  userStories: Array<UserStory> = [];
  tasks: Array<Task> = [];
  epics: Array<Epic> = [];
  backogItem: string = 'userStories';
  showtasklist: { [key: number]: boolean } = {};
  showUserStoriesList: { [key: number]: boolean } = {};

  constructor(
    private userStoriesService: UserStoriesService,
    //private tasksService: TasksService,
    private epicsService: EpicsService,
    private dialog: MatDialog
  ) {}

  private getAllUserStories(): void {
    this.userStoriesService.getAll()
      .subscribe((response: any) => {
        this.userStories = response;

        // Extrae todas las tareas de las historias de usuario
        this.tasks = this.userStories.flatMap(userStory => userStory.tasks);
      });
  }

  private getAllEpics(): void {
    this.epicsService.getAll()
      .subscribe((response: any) => {
        this.epics = response;
      });
  }

  //delete items id
  private deleteUserStory(userStoryId: number): void {
    this.userStoriesService.delete(userStoryId)
      .subscribe(() => {
        this.userStories = this.userStories.filter((userStory: UserStory) => userStory.id !== userStoryId);
      });
  }

  private deleteEpic(epicId: number): void {
    this.epicsService.delete(epicId)
      .subscribe(() => {
        this.epics = this.epics.filter((epic: Epic) => epic.id !== epicId);
      });
  }

  private deleteTask(userStoryId: number, taskId: number): void {
    this.userStoriesService.deleteTask(userStoryId, taskId)
      .subscribe(() => {
        this.getAllUserStories();
      });
  }

  //formularios
  openAddUserStoryForm(): void {
    const dialogRef = this.dialog.open(UserStoryCreateAndEditComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllUserStories();
      }
    });
  }

  removeEpicFromUserStory(userStory: UserStory): void {
    userStory.epicId = 0;
    this.userStoriesService.update(userStory.id, userStory).subscribe(() => {
      this.getAllUserStories();
    });
  }

  openEditUserStoryForm(us: UserStory): void {
    const dialogRef = this.dialog.open(UserStoryCreateAndEditComponent, {
      width: '400px',
      data: us  // Pasamos el us actual para editarlo
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllUserStories();  // Recargamos la lista de issues
      }
    });
  }


  // Tareas: agregar y editar
  openAddTaskForm(us: number): void {
    const task= new Task(0, '', '', 'TO_DO', 0);
    const dialogRef = this.dialog.open(TaskCreateAndEditComponent, {
      width: '400px',
      data: {us, task}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllUserStories();
      }
    });
  }

  openEditTaskForm(us: number, task: Task): void {
    const dialogRef = this.dialog.open(TaskCreateAndEditComponent, {
      width: '400px',
      data: {us, task}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllUserStories();  // Recargamos la lista de tareas
      }
    });
  }

  // Épicos: agregar y editar
  openAddEpicForm(): void {
    const dialogRef = this.dialog.open(EpicCreateAndEditComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllEpics();
      }
    });
  }

  openEditEpicForm(epic: Epic): void {
    const dialogRef = this.dialog.open(EpicCreateAndEditComponent, {
      width: '400px',
      data: epic  // Pasamos el épico actual para editarlo
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllEpics();  // Recargamos la lista de épicos
      }
    });
  }

  showtasks(userStoryId: number): void {
    this.showtasklist[userStoryId] = !this.showtasklist[userStoryId];
  }

  showUserStories(epicId: number): void {
    this.showUserStoriesList[epicId] = !this.showUserStoriesList[epicId];
  }

  //delete
  onDeleteUserStory(element: UserStory) {
    this.deleteUserStory(element.id);
  }

  onDeleteEpic(element: Epic) {
    this.deleteEpic(element.id);
  }


  onDeleteTask(usId: number, element: Task) {
    this.deleteTask(usId, element.taskId);
  }

  //mostrar us, epic o task dependiendo de vista
  showItem(item: string){
    this.backogItem = item;
  }

  ngOnInit(): void {
    this.getAllUserStories();
    //this.getAllTasks();
    this.getAllEpics();
  }
}
