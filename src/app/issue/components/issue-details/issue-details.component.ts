import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA ,MatDialogRef} from '@angular/material/dialog';
import { Issue } from '../../model/issue.entity';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, NgForm } from "@angular/forms";
import { NgClass, NgFor } from "@angular/common";
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-issue-details',
  standalone: true,
  imports: [MatCardModule, FormsModule, NgFor,TranslateModule],
  templateUrl: './issue-details.component.html',
  styleUrls: ['./issue-details.component.css']
})
export class IssueDetailsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public issue: Issue,private dialogRef: MatDialogRef<IssueDetailsComponent>) {}

// Método para cerrar el diálogo
  onClose(): void {
    this.dialogRef.close();  // Cierra el cuadro de diálogo
  }

}
