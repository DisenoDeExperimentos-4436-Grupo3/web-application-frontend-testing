import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TranslateService } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from './public/components/language-switcher/language-switcher.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthenticationSectionComponent } from './iam/components/authentication-section/authentication-section.component';
import { AuthenticationService } from './iam/services/authentication.service';
import { TranslateModule } from '@ngx-translate/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    LanguageSwitcherComponent,
    CommonModule,
    AuthenticationSectionComponent,
    TranslateModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ManageWise';
  isSignedIn: boolean = false;
  @ViewChild(MatSidenav, { static: true }) sidenav!: MatSidenav;

  options = [
    { path: '/authentication', title: 'Authentication' },
  ];

  otherOptions = [
    { icon: 'https://cdn-icons-png.flaticon.com/512/87/87578.png', path: '/statistics', title: 'Statistics' },
    { icon: 'https://i.imgur.com/X51XVUz.png', path: '/backlog', title: 'Backlog' },
    { icon: 'https://i.imgur.com/xQxGLrm.png', path: '/issues', title: 'Issues' },
    { icon: 'https://i.imgur.com/XkRHbGU.png', path: '/members', title: 'Members' },
    { icon: 'https://i.imgur.com/n1IHpmx.png', path: '/meeting', title: 'Meeting' },
  ];

  constructor(
    private translate: TranslateService,
    private observer: BreakpointObserver,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    // Configuración de traducción
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit(): void {
    // Observando el estado de la autenticación
    this.authenticationService.isSignedIn.subscribe(
      (isSignedIn) => {
        this.isSignedIn = isSignedIn;
        // Si el usuario no está autenticado, redirigimos a la página de inicio de sesión
        if (!isSignedIn) {
          this.router.navigate(['/sign-in']);
        }
      }
    );

    // Configuración de la vista de Sidenav dependiendo del tamaño de la pantalla
    this.observer.observe(['(max-width: 1280px)']).subscribe((response) => {
      if (response.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
  }


}
