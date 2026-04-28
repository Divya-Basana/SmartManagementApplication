using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartManagementApi.Data;
using SmartManagementApi.Models;

namespace SmartManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/user
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            Console.WriteLine("[DEBUG] Fetching all users...");
            var users = await _context.Users.OrderByDescending(u => u.CreatedAt).ToListAsync();
            return Ok(users);
        }

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

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            return user == null ? NotFound() : Ok(user);
        }

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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
