import { Component } from '@angular/core';

import { ProductBacklogComponent} from "../../components/product-backlog/product-backlog.component";

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-backlog-page',
  standalone: true,
  imports: [ProductBacklogComponent, RouterModule],
  templateUrl: './backlog-page.component.html',
  styleUrl: './backlog-page.component.css'
})
export class BacklogPageComponent {

}
