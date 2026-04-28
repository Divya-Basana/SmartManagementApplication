import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

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

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.userId = +id;
      this.loadUser(this.userId);
    }
  }

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

  private handleSuccess(msg: string): void {
    this.loading = false;
    alert(msg);
    // Explicitly navigate to ensure list re-fetches on init
    this.router.navigate(['/user-list']);
  }

  private handleError(msg: string, err?: any): void {
    this.loading = false;
    this.errorMessage = msg;
    // Show alert for immediate feedback
    alert(msg + (err?.message ? '\nError: ' + err.message : ''));
    if (err) console.error(msg, err);
  }

  get f() { return this.userForm.controls; }
}
