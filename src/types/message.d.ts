import { Role } from 'generated/prisma/client';

type Message = {
  id: string;
  role: Role;
  text: string;
  createdAt: Date;
  updatedAt: Date;
};
