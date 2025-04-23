import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from "@angular/forms";
import { NgFor } from "@angular/common";
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Epic } from "../../model/epic.entity";
import {EpicsService} from "../../services/epics.service";

import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-epic-create-and-edit',
  standalone: true,
  imports: [MatCardModule, FormsModule, NgFor, MatFormFieldModule, MatInputModule, MatSelectModule, TranslateModule],
  templateUrl: './epic-create-and-edit.component.html',
  styleUrls: ['./epic-create-and-edit.component.css']
})
export class EpicCreateAndEditComponent {
  newEpic: Epic;

  constructor(
    private epicService: EpicsService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<EpicCreateAndEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Epic
  ) {
    this.newEpic = data ? { ...data } : new Epic(0, '', '', 'TO_DO');
  }

  onSubmit(): void {
    if (this.newEpic.id) {
      this.epicService.update(this.newEpic.id, this.newEpic).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      this.epicService.create(this.newEpic).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
