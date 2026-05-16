import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// ============================================================================
// File: app.ts
// Purpose: Root component of the Angular application.
// Acts as the main container for the router outlet and core layout.
// ============================================================================

/**
 * The main application component that bootstraps the UI layout.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('SmartManagementApp');
}
