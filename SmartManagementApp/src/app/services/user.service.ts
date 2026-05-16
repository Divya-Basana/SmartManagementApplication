import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

// ============================================================================
// File: user.service.ts
// Purpose: Centralized service for user-related HTTP API calls.
// Handles communication between the Angular frontend and ASP.NET backend.
// ============================================================================

/**
 * Service responsible for executing CRUD operations against the User API.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Required fixed port for https
  private apiUrl = 'https://localhost:5006/api/user';

  /**
   * Constructor injects HttpClient to perform network requests.
   * @param http Angular HttpClient instance
   */
  constructor(private http: HttpClient) { }

  /**
   * Fetches the complete list of users.
   * @returns Observable emitting an array of User objects.
   */
  getUsers(): Observable<User[]> {
    console.log('UserService: Fetching users from', this.apiUrl);
    return this.http.get<User[]>(this.apiUrl);
  }

  /**
   * Fetches a single user by ID.
   * @param id The unique identifier of the user.
   * @returns Observable emitting the requested User object.
   */
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  /**
   * Submits a new user object to the API for creation.
   * @param user The new User object data.
   * @returns Observable emitting the successfully created User object.
   */
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  /**
   * Updates an existing user's record via the API.
   * @param id The ID of the user being updated.
   * @param user The updated User object.
   * @returns Observable emitting the updated User object.
   */
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  /**
   * Deletes a specific user by calling the API's delete endpoint.
   * @param id The ID of the user to remove.
   * @returns Observable emitting upon successful deletion.
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
