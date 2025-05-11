import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

(window as any).onRecaptchaLoadCallback = () => {
  console.log('[reCAPTCHA] onRecaptchaLoadCallback ready');
};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
