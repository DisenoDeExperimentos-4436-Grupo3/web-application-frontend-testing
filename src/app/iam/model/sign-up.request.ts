export class SignUpRequest {
  public username: string;
  public password: string;
  public recaptchaToken?: string

  constructor(username: string, password: string, recaptchaToken: string) {
    this.password = password;
    this.username = username;
    this.recaptchaToken = recaptchaToken;
  }
}
