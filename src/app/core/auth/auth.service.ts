import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { IndexedDbAuthService } from './indexeddb-auth.service';
import { UserSession, DemoAccount } from '../../shared/models/user-session.model';

export const DEMO_AUDITOR: DemoAccount = {
  username: 'demo.auditor@healthai.local',
  displayName: 'Alex Taylor, CPC (Senior RCM Specialist)',
  role: 'OPERATOR',
  description: 'Lead Revenue Cycle Auditor with full audit, PA verification, and appeal drafting privileges'
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly indexedDb = inject(IndexedDbAuthService);
  private readonly router = inject(Router);

  private readonly sessionSignal = signal<UserSession | null>(null);
  private readonly initializedSignal = signal<boolean>(false);

  readonly currentSession = computed(() => this.sessionSignal());
  readonly currentUser = computed(() => this.sessionSignal()?.username ?? null);
  readonly displayName = computed(() => this.sessionSignal()?.displayName ?? 'Guest');
  readonly userRole = computed(() => this.sessionSignal()?.role ?? null);
  readonly isAuthenticated = computed(() => !!this.sessionSignal()?.token);
  readonly isInitialized = computed(() => this.initializedSignal());

  constructor() {
    this.hydrateSession();
  }

  async hydrateSession(): Promise<UserSession | null> {
    try {
      const session = await this.indexedDb.getSession();
      this.sessionSignal.set(session);
      return session;
    } catch {
      this.sessionSignal.set(null);
      return null;
    } finally {
      this.initializedSignal.set(true);
    }
  }

  async login(username: string, token?: string, displayName?: string): Promise<void> {
    const session: UserSession = {
      id: 'current_active_session',
      username,
      displayName: displayName ?? username.split('@')[0],
      role: 'OPERATOR',
      token: token ?? `mock_jwt_token_${Date.now()}`,
      loginTimestamp: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24-hour expiry
    };

    await this.indexedDb.saveSession(session);
    this.sessionSignal.set(session);
  }

  async loginAsDemoUser(demo: DemoAccount = DEMO_AUDITOR): Promise<void> {
    const session: UserSession = {
      id: 'current_active_session',
      username: demo.username,
      displayName: demo.displayName,
      role: demo.role,
      token: `demo_session_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      loginTimestamp: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7-day expiry for demo
    };

    await this.indexedDb.saveSession(session);
    this.sessionSignal.set(session);
  }

  async logout(): Promise<void> {
    await this.indexedDb.clearSession();
    this.sessionSignal.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.sessionSignal()?.token ?? null;
  }
}
