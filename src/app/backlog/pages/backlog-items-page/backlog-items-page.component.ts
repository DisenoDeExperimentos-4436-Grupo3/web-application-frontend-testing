import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { BacklogItemsManagementComponent} from "../../components/backlog-items-management/backlog-items-management.component";

@Component({
  selector: 'app-backlog-items-page',
  standalone: true,
  imports: [RouterModule, BacklogItemsManagementComponent],
  templateUrl: './backlog-items-page.component.html',
  styleUrl: './backlog-items-page.component.css'
})
export class BacklogItemsPageComponent {

}
