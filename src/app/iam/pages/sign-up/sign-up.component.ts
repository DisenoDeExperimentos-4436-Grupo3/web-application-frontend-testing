import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { BaseFormComponent } from "../../../shared/components/base-form.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthenticationService } from "../../services/authentication.service";
import { SignUpRequest } from "../../model/sign-up.request";
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { MatError, MatFormField } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatButton } from "@angular/material/button";
import { NgIf } from "@angular/common";
import { AuthenticationSectionComponent } from "../../../iam/components/authentication-section/authentication-section.component";
import {RouterLink} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";

declare global {
  interface Window {
    onRecaptchaLoadCallback: () => void;
  }
}


declare const grecaptcha: any;

@Component({
  selector: 'app-sign-up',
  standalone: true,
    imports: [
        MatCard,
        MatCardHeader,
        MatCardContent,
        MatFormField,
        ReactiveFormsModule,
        MatInput,
        MatButton,
        MatCardTitle,
        MatError,
        NgIf,
        AuthenticationSectionComponent,
        RouterLink,
        TranslateModule,
        // Import the AuthenticationSectionComponent here
    ],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent extends BaseFormComponent implements OnInit, AfterViewInit {

  form!: FormGroup;
  submitted = false;

  @ViewChild('captchaElem', { static: false }) captchaElem!: ElementRef;
  captchaId: any;

  ngAfterViewInit(): void {
    const waitForCaptchaReady = setInterval(() => {
      if (typeof grecaptcha !== 'undefined' && this.captchaElem) {
        this.captchaId = grecaptcha.render(this.captchaElem.nativeElement, {
          sitekey: '6Lcb4zUrAAAAAOc0qxROmE9k9Cy3b_vUwBLC9ccs',
          callback: (token: string) => {
            console.log('Captcha token:', token);
          }
        });
        clearInterval(waitForCaptchaReady);
      }
    }, 500);
  }

  constructor(private builder: FormBuilder, private authenticationService: AuthenticationService) {
    super();
  }

  ngOnInit(): void {
    this.form = this.builder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const token = grecaptcha.getResponse(this.captchaId);
    if (!token) {
      alert('Por favor resuelve el CAPTCHA.');
      return;
    }

    const { username, password } = this.form.value;
    const signUpRequest = new SignUpRequest(username, password, token);
    this.authenticationService.signUp(signUpRequest);
    this.submitted = true;

    grecaptcha.reset(this.captchaId);
  }
}
