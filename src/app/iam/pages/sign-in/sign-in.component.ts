import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from "../../services/authentication.service";
import { BaseFormComponent } from "../../../shared/components/base-form.component";
import { SignInRequest } from "../../model/sign-in.request";
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { MatError, MatFormField } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatButton } from "@angular/material/button";
import { NgIf } from "@angular/common";
import { AuthenticationSectionComponent } from "../../../iam/components/authentication-section/authentication-section.component";

declare global {
  interface Window {
    onRecaptchaLoadCallback: () => void;
  }
}


declare const grecaptcha: any;


@Component({
  selector: 'app-sign-in',
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
    AuthenticationSectionComponent
  ],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent extends BaseFormComponent implements OnInit, AfterViewInit {

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
    const signInRequest = new SignInRequest(username, password, token);
    this.authenticationService.signIn(signInRequest);
    this.submitted = true;

    grecaptcha.reset(this.captchaId);
  }
}

