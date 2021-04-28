using capstone.Data;
using capstone.Models;
using capstone.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace capstone.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        public ApplicationDbContext _context;
        public AccountController(ApplicationDbContext context)
        {
            _context = context;
        }
        // GET: api/<AccountController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        [HttpGet("Home")]
        public async Task<IActionResult> HomePage()
        {
            HomeResponse response = new HomeResponse()
            {
                Authenticated = false,
                LoggedIn = false,
                Registered = false
            };
            try
            {
                if (User.Identity.IsAuthenticated)
                {
                    response.Authenticated = true;
                    var userId = this.User.FindFirstValue("sub");
                    Account account = await _context.Accounts.Where(a => a.ApplicationUserId == userId).SingleOrDefaultAsync();
                    if (account != null)
                    {
                        response.LoggedIn = true;
                        response.Registered = account.Registered;
                    }
                    else
                    {
                        account = new Account()
                        {
                            ApplicationUserId = userId,
                            Registered = false
                        };
                        await _context.AddAsync(account);
                        await _context.SaveChangesAsync();
                    }
                }
                return Ok(response);
            }
            catch
            {
                return StatusCode(500, response);
            }
        }

        // GET api/<AccountController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<AccountController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<AccountController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<AccountController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
