import { betterAuth } from 'better-auth';
import { getAuthConfig } from './config';

export const auth = betterAuth(getAuthConfig());

export type Auth = typeof auth;
export type Session = typeof auth.$Infer.Session;
