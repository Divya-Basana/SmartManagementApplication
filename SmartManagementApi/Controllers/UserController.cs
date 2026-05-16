using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartManagementApi.Data;
using SmartManagementApi.Models;

// ============================================================================
// File: UserController.cs
// Purpose: Handles incoming HTTP requests related to User management.
// Acts as the API endpoint controller for CRUD operations on Users.
// ============================================================================

namespace SmartManagementApi.Controllers
{
    /// <summary>
    /// RESTful API Controller responsible for user data operations.
    /// Exposes endpoints for creating, reading, updating, and deleting user records.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        /// <summary>
        /// Constructor for UserController.
        /// Inputs: AppDbContext (Injected database context)
        /// Outputs: Instance of UserController
        /// Logic: Initializes the local context field for database operations.
        /// </summary>
        public UserController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves a list of all active and inactive users.
        /// Inputs: None
        /// Outputs: ActionResult containing an IEnumerable of User objects.
        /// Logic: Queries the database, sorts by creation date descending, and returns 200 OK.
        /// </summary>
        // GET: api/user
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            Console.WriteLine("[DEBUG] Fetching all users...");
            var users = await _context.Users.OrderByDescending(u => u.CreatedAt).ToListAsync();
            return Ok(users);
        }

        /// <summary>
        /// Creates a new user record in the system.
        /// Inputs: User object (from request body)
        /// Outputs: Created ActionResult with the newly created User.
        /// Logic: Validates input, sets creation timestamp, saves to DB, and returns 201 Created.
        /// </summary>
        // POST: api/user
        [HttpPost]
        public async Task<ActionResult<User>> CreateUser(User user)
        {
            Console.WriteLine($"[DEBUG] Creating user: {user.EmailAddress}");
            
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Set CreatedAt to local server time as requested
            user.CreatedAt = DateTime.Now;
            
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            
            Console.WriteLine($"[DEBUG] User created at {user.CreatedAt}");
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        /// <summary>
        /// Retrieves a specific user by their unique identifier.
        /// Inputs: int id (User ID from URL path)
        /// Outputs: ActionResult containing the User object, or 404 Not Found.
        /// Logic: Searches the database for the matching primary key.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            return user == null ? NotFound() : Ok(user);
        }

        /// <summary>
        /// Updates an existing user's details.
        /// Inputs: int id (URL path), User object (Request body)
        /// Outputs: IActionResult (200 OK with updated object, or BadRequest/NotFound)
        /// Logic: Validates ID match, updates modified state, protects CreatedAt field, and saves changes.
        /// </summary>
        // PUT: api/user/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, User user)
        {
            Console.WriteLine($"[DEBUG] Updating user ID: {id}");
            
            if (id != user.Id)
            {
                return BadRequest("ID mismatch");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(user).State = EntityState.Modified;

            // Ensure we don't accidentally overwrite CreatedAt if it's sent as default/null
            _context.Entry(user).Property(x => x.CreatedAt).IsModified = false;

            try
            {
                await _context.SaveChangesAsync();
                Console.WriteLine("[DEBUG] Update successful, returning updated object.");
                return Ok(user); // Return 200 OK with the object as requested
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id)) return NotFound();
                throw;
            }
        }

        /// <summary>
        /// Removes a user from the system based on ID.
        /// Inputs: int id (User ID to delete)
        /// Outputs: IActionResult (204 No Content on success, 404 Not Found if missing)
        /// Logic: Finds user, removes entity from context, and commits transaction.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        /// <summary>
        /// Helper method to check if a user exists in the database.
        /// Inputs: int id (User ID)
        /// Outputs: boolean (True if exists, false otherwise)
        /// Logic: Uses LINQ Any() to efficiently check for existence without loading the full entity.
        /// </summary>
        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
