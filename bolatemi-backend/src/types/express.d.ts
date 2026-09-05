import { Role } from "@prisma/client";

// Augments Express's Request with the authenticated admin user, attached
// by the `authenticate` middleware after verifying the JWT.
declare global {
  namespace Express {
    interface Request {
      admin?: {
        id: string;
        email: string;
        role: Role;
      };
    }
  }
}

export {};
