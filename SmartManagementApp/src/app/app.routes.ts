import { Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { CreateUserComponent } from './components/create-user/create-user.component';

// ============================================================================
// File: app.routes.ts
// Purpose: Defines the routing map for the Angular application.
// Maps URLs to their corresponding components.
// ============================================================================

/**
 * Array of route definitions. Includes default redirect, view routes, and wildcard catch-all.
 */
export const routes: Routes = [
  { path: '', redirectTo: 'user-list', pathMatch: 'full' },
  { path: 'user-list', component: UserListComponent },
  { path: 'create-user', component: CreateUserComponent },
  { path: 'edit-user/:id', component: CreateUserComponent },
  { path: '**', redirectTo: 'user-list' }
];
