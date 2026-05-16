using System.ComponentModel.DataAnnotations;

// ============================================================================
// File: User.cs
// Purpose: Defines the User entity model for the database schema.
// This model represents the core data structure for user management.
// ============================================================================

namespace SmartManagementApi.Models
{
    /// <summary>
    /// Represents a user within the Smart Management system.
    /// Acts as the primary data transfer object (DTO) and database entity.
    /// </summary>
    public class User
    {
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        public string EmailAddress { get; set; } = string.Empty;

        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [RegularExpression(@"^\d{10}$", ErrorMessage = "Phone number must be 10 digits.")]
        public string Phone { get; set; } = string.Empty;

        [Required]
        public string EmployeeType { get; set; } = string.Empty;

        [Required]
        public string CompanyName { get; set; } = string.Empty;

        public bool IsActive { get; set; }

        public DateTime? LastLogin { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
