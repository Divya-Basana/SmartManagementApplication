import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

// ============================================================================
// File: create-user.component.ts
// Purpose: Component for creating and editing user profiles.
// Handles reactive forms, input validation, and API integration.
// ============================================================================

/**
 * Controller class for the Create/Edit User view.
 * Manages form state, submission logic, and routing.
 */
@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  userForm: FormGroup;
  isEditMode: boolean = false;
  userId: number | null = null;
  loading: boolean = false;
  submitted: boolean = false;
  errorMessage: string = '';

  employeeTypes: string[] = ['Admin', 'Employee', 'Manager', 'Contractor'];

  /**
   * Initializes dependencies and sets up the reactive form group.
   * Inputs: FormBuilder, UserService, Router, ActivatedRoute
   * Logic: Configures form controls with necessary validation rules.
   */
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      id: [0],
      emailAddress: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      employeeType: ['', Validators.required],
      companyName: ['', Validators.required],
      isActive: [true]
    });
  }

  /**
   * Lifecycle hook called after component initialization.
   * Logic: Checks if there is an 'id' route parameter to determine if it's Edit Mode.
   */
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.userId = +id;
      this.loadUser(this.userId);
    }
  }

  /**
   * Fetches the user data from the backend to pre-fill the edit form.
   * @param id The ID of the user to load.
   */
  loadUser(id: number): void {
    this.loading = true;
    this.userService.getUser(id).subscribe({
      next: (user) => {
        this.userForm.patchValue(user);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading user:', err);
        this.loading = false;
      }
    });
  }

  /**
   * Handles the form submission for both creating and updating a user.
   * Logic: Validates form, determines API call based on isEditMode flag, and handles response.
   */
  onSubmit(): void {
    this.submitted = true;
    if (this.userForm.invalid) {
      console.warn('Form validation failed:', this.userForm.errors);
      alert('Please fill all required fields correctly before submitting.');
      return;
    }

    this.loading = true;
    const userData: User = this.userForm.value;

    if (this.isEditMode && this.userId) {
      console.log('Updating user...', userData);
      this.userService.updateUser(this.userId, userData).subscribe({
        next: (res) => {
          console.log('Update success!', res);
          this.handleSuccess('User updated successfully!');
        },
        error: (err) => {
          console.error('Update error:', err);
          this.handleError('Failed to update user.', err);
        }
      });
    } else {
      console.log('Creating user...', userData);
      this.userService.createUser(userData).subscribe({
        next: (res) => {
          console.log('Create success!', res);
          this.handleSuccess('User created successfully!');
        },
        error: (err) => {
          console.error('Create error:', err);
          this.handleError('Failed to create user.', err);
        }
      });
    }
  }

  /**
   * Helper method to handle successful API responses.
   * @param msg The success message to display.
   */
  private handleSuccess(msg: string): void {
    this.loading = false;
    alert(msg);
    // Explicitly navigate to ensure list re-fetches on init
    this.router.navigate(['/user-list']);
  }

  /**
   * Helper method to handle API error responses.
   * @param msg The error message to display.
   * @param err The actual error object from the API.
   */
  private handleError(msg: string, err?: any): void {
    this.loading = false;
    this.errorMessage = msg;
    // Show alert for immediate feedback
    alert(msg + (err?.message ? '\nError: ' + err.message : ''));
    if (err) console.error(msg, err);
  }

  /**
   * Convenience getter for easy access to form fields in the HTML template.
   */
  get f() { return this.userForm.controls; }
}
