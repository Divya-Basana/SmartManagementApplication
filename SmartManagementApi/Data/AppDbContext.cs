using Microsoft.EntityFrameworkCore;
using SmartManagementApi.Models;

// ============================================================================
// File: AppDbContext.cs
// Purpose: Configures Entity Framework Core database context.
// Acts as the bridge between the application models and SQL Server.
// ============================================================================

namespace SmartManagementApi.Data
{
    /// <summary>
    /// The main database context class responsible for handling database connections
    /// and managing the entity sets (tables) within the SQL Server database.
    /// </summary>
    public class AppDbContext : DbContext
    {
        /// <summary>
        /// Constructor that initializes the database context with specified options.
        /// Inputs: DbContextOptions (Contains connection string and provider info)
        /// Outputs: Instance of AppDbContext
        /// </summary>
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        /// <summary>
        /// Represents the Users table in the database.
        /// Allows querying and saving instances of the User entity.
        /// </summary>
        public DbSet<User> Users { get; set; }
    }
}
