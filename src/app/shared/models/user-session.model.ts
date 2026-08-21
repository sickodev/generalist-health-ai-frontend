export type UserRole = 'OPERATOR' | 'ADMIN' | 'BILLER';

export interface UserSession {
  id: string; // e.g. 'current_session'
  username: string;
  displayName: string;
  role: UserRole;
  token: string;
  loginTimestamp: number;
  expiresAt: number;
}

export interface DemoAccount {
  username: string;
  displayName: string;
  role: UserRole;
  description: string;
}
