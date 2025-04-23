import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [MatButtonToggleModule, CommonModule], // Agrega CommonModule aquí
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css'] // Corrige "styleUrl" a "styleUrls"
})
export class LanguageSwitcherComponent {
  currentLang: string = 'en';
  languages: string[] = ['en', 'es'];

  constructor(private translate: TranslateService) {
    this.currentLang = translate.currentLang;
  }

  useLanguage(language: string): void {
    this.translate.use(language);
  }
}
