import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.js';
import { env } from '../config/env.js';

export function hashPassword(password: string): string {
   return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, hash: string): boolean {
   return bcrypt.compareSync(password, hash);
}

export function generateToken(user: User): string {
   const { id: userId, role } = user;
   return jwt.sign(
      { userId, role }, 
      env.JWT_SECRET,
      { expiresIn: '1h' }
   );
}

export function verifyToken(token: string): JwtPayload {
   return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}