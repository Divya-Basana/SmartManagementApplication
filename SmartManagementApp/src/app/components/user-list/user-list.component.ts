import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  selectedUser: User | null = null;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    console.log('UserList: Calling getUsers...');
    this.userService.getUsers().subscribe({
      next: (data) => {
        console.log('UserList: API Success - Data length:', data.length);
        this.users = data;
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges(); // Force UI update
      },
      error: (err) => {
        console.error('UserList: API Error:', err);
        this.errorMessage = 'Could not fetch user list. Verify backend is running on https://localhost:5001';
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    if (!this.searchTerm) {
      this.filteredUsers = [...this.users];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredUsers = this.users.filter(u => 
        u.firstName.toLowerCase().includes(term) || 
        u.lastName.toLowerCase().includes(term) || 
        u.emailAddress.toLowerCase().includes(term)
      );
    }
  }

  deleteUser(id: number | undefined): void {
    if (!id) return;
    if (confirm('Delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.successMessage = 'User deleted.';
          this.loadUsers();
        },
        error: (err) => {
          console.error('Delete error:', err);
          this.errorMessage = 'Delete failed.';
        }
      });
    }
  }

  viewDetails(user: User): void {
    this.selectedUser = user;
  }
}
