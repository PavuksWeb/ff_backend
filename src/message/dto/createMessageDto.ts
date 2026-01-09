/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'generated/prisma/client';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsEnum(Role, { message: 'Invalid role type' })
  @IsNotEmpty()
  role: Role;
}
