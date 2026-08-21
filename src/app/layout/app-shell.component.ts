import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SidebarNavComponent } from './sidebar-nav.component';
import { TopbarComponent } from './topbar.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    SidebarNavComponent,
    TopbarComponent
  ],
  template: `
    <mat-sidenav-container class="shell-container" autosize>
      <!-- Sidenav Drawer -->
      <mat-sidenav
        #sidenav
        [mode]="isMobile() ? 'over' : 'side'"
        [opened]="!isMobile()"
        class="shell-sidenav"
      >
        <app-sidebar-nav (navItemClicked)="onNavClicked()"></app-sidebar-nav>
      </mat-sidenav>

      <!-- Main Shell Content -->
      <mat-sidenav-content class="shell-content">
        <app-topbar (toggleMenu)="sidenav.toggle()"></app-topbar>
        <main class="page-body">
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .shell-container {
      height: 100vh;
      width: 100vw;
      background: var(--rcm-bg-app, #f8fafc);
    }
    .shell-sidenav {
      width: 260px;
      border-right: none;
    }
    .shell-content {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow-y: auto;
    }
    .page-body {
      flex: 1;
      padding: 1.5rem;
      max-width: 1400px;
      width: 100%;
      margin: 0 auto;
      box-sizing: border-box;
    }
    @media (max-width: 768px) {
      .page-body {
        padding: 1rem;
      }
    }
  `]
})
export class AppShellComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly isMobile = toSignal(
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.TabletPortrait]).pipe(
      map(result => result.matches)
    ),
    { initialValue: false }
  );

  onNavClicked(): void {
    if (this.isMobile()) {
      this.sidenav.close();
    }
  }
}
