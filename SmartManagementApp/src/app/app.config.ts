import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

// ============================================================================
// File: app.config.ts
// Purpose: Main configuration file for the Angular application.
// Sets up core providers like routing and HTTP client.
// ============================================================================

/**
 * Global application configuration object containing providers.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient()
  ]
};
