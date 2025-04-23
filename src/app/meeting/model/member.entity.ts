export class Member {
  id: number;
  profile: {
    fullName: string;
    email: string;
    streetAddress: string;
  };
  role: string;

  constructor(
    id: number,
    fullName: string,
    email: string,
    streetAddress: string,
    role: string
  ) {
    this.id = id;
    this.profile = {
      fullName,
      email,
      streetAddress,
    };
    this.role = role;
  }
}
