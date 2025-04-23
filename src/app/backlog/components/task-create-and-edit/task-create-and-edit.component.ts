import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from "@angular/forms";
import { NgFor } from "@angular/common";
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Task } from "../../model/task.entity";

import {UserStoriesService} from "../../services/user-stories.service";
import {UserStory} from "../../model/user-story.entity";


import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-task-create-and-edit',
  standalone: true,
  imports: [MatCardModule, FormsModule, NgFor, MatFormFieldModule, MatInputModule, MatSelectModule, TranslateModule],
  templateUrl: './task-create-and-edit.component.html',
  styleUrls: ['./task-create-and-edit.component.css']
})
export class TaskCreateAndEditComponent {
  newTask: Task;
  newUserStory: number;

  constructor(
    private userStoryService: UserStoriesService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<TaskCreateAndEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { us: number, task: Task }
  ) {
    this.newTask = data.task ? { ...data.task } : new Task(0, '', '', 'TO_DO', 0);
    this.newUserStory = data.us;
    console.log('us:', this.newUserStory);
  }

  onSubmit(): void {
    //console.log('Form Data:', this.newTask);
    //console.log('Form Data:', this.newUserStory.id);

    if (this.newTask.taskId) {
      this.userStoryService.updateTask(this.newUserStory, this.newTask.taskId, this.newTask).subscribe(() => {
        this.dialogRef.close(true);
      }, error => {
        console.error("Error updating task", error);
      });
    } else {
      this.userStoryService.addTask(this.newUserStory, this.newTask).subscribe(() => {
        this.dialogRef.close(true);
      }, error => {
        console.error("Error adding task", error);
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
