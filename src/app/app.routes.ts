  import { Routes } from '@angular/router';
  import { PageNotFoundComponent } from "./public/pages/page-not-found/page-not-found.component";
  import { TimelinePageComponent } from './statistic/pages/timeline-page/timeline-page.component'; // Cambia TimeLine a Timeline
  import { BacklogPageComponent } from './backlog/pages/backlog-page/backlog-page.component';
  import { BacklogItemsPageComponent } from './backlog/pages/backlog-items-page/backlog-items-page.component';
import { MeetingManagementComponent } from './meeting/pages/meeting-management/meeting-management.component'; // Cambia TimeLine a Timeline
import { RecordingManagementComponent } from './meeting/components/recording-management/recording-management.component'; // Cambia TimeLine a Timeline
import { MemberManagementComponent } from "./members/pages/member-management/member-management.component";
import { IssuesListComponent } from './issue/pages/issues-list/issues-list.component';
import { SignInComponent } from './iam/pages/sign-in/sign-in.component';
import { SignUpComponent } from './iam/pages/sign-up/sign-up.component';
import {authenticationGuard} from './iam/services/authentication.guard';
import {AuthenticationSectionComponent} from './iam/components/authentication-section/authentication-section.component'
  export const routes: Routes = [
    { path: 'statistics', component: TimelinePageComponent },
    { path: 'backlog', component: BacklogPageComponent, canActivate: [authenticationGuard] },
    { path: 'backlog-items', component: BacklogItemsPageComponent, canActivate: [authenticationGuard] },
    { path: 'members', component: MemberManagementComponent ,canActivate: [authenticationGuard]},
    { path: 'meeting', component: MeetingManagementComponent, canActivate: [authenticationGuard] },
    { path: 'issues', component: IssuesListComponent,canActivate: [authenticationGuard] },

    { path: 'recording', component: RecordingManagementComponent},
    { path: '', component: PageNotFoundComponent },
     // Asegúrate de que esta ruta esté definida
    { path: 'sign-in', component: SignInComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: '**', component: BacklogPageComponent}
  ];



