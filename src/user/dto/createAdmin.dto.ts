export class CreateUserDto {
  readonly email: string;
  readonly password: string;
  readonly name: string;
  readonly role: string;
  readonly token: string;
}
