// ============================================================================
// File: user.model.ts
// Purpose: Defines the User interface for frontend data structures.
// Ensures type safety when handling user data throughout the application.
// ============================================================================

/**
 * Interface representing the shape of User data received from/sent to the API.
 */
export interface User {
  id?: number;
  emailAddress: string;
  firstName: string;
  lastName: string;
  phone: string;
  employeeType: string;
  companyName: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt?: Date;
}
