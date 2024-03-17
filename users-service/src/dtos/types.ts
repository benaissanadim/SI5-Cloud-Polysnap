import { IsNotEmpty } from 'class-validator';

export class SignUpDetails {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  email: string;
}

type PartialLookUpUserParams = {
  id?: number;
  email?: string;
  username?: string;
};

export class LookUpUserParams implements Partial<PartialLookUpUserParams> {
  id?: number;
  email?: string;
  username?: string;
}

export class AddContactParams {
  userId: number;
  contactId: number;
}
