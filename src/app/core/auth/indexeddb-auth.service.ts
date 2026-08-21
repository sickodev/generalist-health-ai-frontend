import { Injectable } from '@angular/core';
import { UserSession } from '../../shared/models/user-session.model';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbAuthService {
  private readonly dbName = 'rcm_security_db';
  private readonly dbVersion = 1;
  private readonly storeName = 'auth_sessions';
  private readonly sessionKey = 'current_active_session';

  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDb(): Promise<IDBDatabase> {
    if (this.dbPromise) {
      return this.dbPromise;
    }

    this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB is not supported in this environment.'));
        return;
      }

      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };

      request.onsuccess = (event: Event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };

      request.onerror = (event: Event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });

    return this.dbPromise;
  }

  async saveSession(session: UserSession): Promise<void> {
    try {
      const db = await this.getDb();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const record = { ...session, id: this.sessionKey };
        const request = store.put(record);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn('Fallback to localStorage due to IndexedDB error:', error);
      localStorage.setItem(this.sessionKey, JSON.stringify(session));
    }
  }

  async getSession(): Promise<UserSession | null> {
    try {
      const db = await this.getDb();
      return new Promise<UserSession | null>((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(this.sessionKey);

        request.onsuccess = () => {
          const result = request.result as UserSession | undefined;
          if (!result) {
            resolve(null);
            return;
          }
          // Check expiration
          if (result.expiresAt && Date.now() > result.expiresAt) {
            this.clearSession().then(() => resolve(null));
          } else {
            resolve(result);
          }
        };

        request.onerror = () => reject(request.error);
      });
    } catch {
      const fallback = localStorage.getItem(this.sessionKey);
      if (fallback) {
        try {
          const parsed = JSON.parse(fallback) as UserSession;
          if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
            localStorage.removeItem(this.sessionKey);
            return null;
          }
          return parsed;
        } catch {
          return null;
        }
      }
      return null;
    }
  }

  async clearSession(): Promise<void> {
    try {
      localStorage.removeItem(this.sessionKey);
      const db = await this.getDb();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(this.sessionKey);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch {
      localStorage.removeItem(this.sessionKey);
    }
  }
}
