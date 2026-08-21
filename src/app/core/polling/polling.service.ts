import { Injectable } from '@angular/core';
import { Observable, timer, switchMap, takeWhile, shareReplay, retry } from 'rxjs';
import { AuditJob } from '../../shared/models/audit-job.model';

@Injectable({
  providedIn: 'root'
})
export class PollingService {
  /**
   * Polls a job status endpoint every `intervalMs` until terminal status ('DONE' or 'FAILED') is reached.
   * Emits the final terminal event before completing.
   */
  pollJob(fetchFn: () => Observable<AuditJob>, intervalMs = 2000): Observable<AuditJob> {
    return timer(0, intervalMs).pipe(
      switchMap(() => fetchFn()),
      takeWhile(
        job => job.status !== 'DONE' && job.status !== 'FAILED',
        true // inclusive: emits the final DONE or FAILED state
      ),
      retry({
        count: 5,
        delay: (_, retryCount) => timer(Math.min(1000 * Math.pow(2, retryCount), 15000))
      }),
      shareReplay(1)
    );
  }
}
