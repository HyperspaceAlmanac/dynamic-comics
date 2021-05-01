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

        [HttpGet("Home")]
        public async Task<IActionResult> HomePage()
        {
            UserStatus response = new UserStatus()
            {
                Authenticated = false,
                LoggedIn = false
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
                        response.UserName = account.UserName;
                    }
                }
                return Ok(response);
            }
            catch
            {
                return StatusCode(500, response);
            }
        }

        [HttpPut("GetUser")]
        public async Task<IActionResult> GetUser([FromBody] ProfileRequest profile)
        {
            ProfileResponse response = new ProfileResponse();
            try
            {
                if (User.Identity.IsAuthenticated)
                {
                    var userId = this.User.FindFirstValue("sub");
                    Account account = await _context.Accounts.Where(a => a.ApplicationUserId == userId).SingleOrDefaultAsync();
                    if (account == null)
                    {
                        return StatusCode(500, response);
                    }
                    Account current = await _context.Accounts.Where(a => a.UserName == profile.CurrentProfile).SingleOrDefaultAsync();
                    if (account == null)
                    {
                        return StatusCode(500, response);
                    }
                    response.LoggedInUser = account.UserName;
                    response.Theme = current.Theme;
                    response.Font = current.Font;
                    response.Message = current.Message;
                }
                return Ok(response);
            }
            catch
            {
                return StatusCode(500, response);
            }
        }
        [HttpPut("SetUserPage")]
        public async Task<IActionResult> SetUserPage([FromBody] ProfileSet profile)
        {
            ProfileResponse response = new ProfileResponse();
            try
            {
                if (User.Identity.IsAuthenticated)
                {
                    var userId = this.User.FindFirstValue("sub");
                    Account account = await _context.Accounts.Where(a => a.ApplicationUserId == userId).SingleOrDefaultAsync();
                    if (account == null)
                    {
                        return StatusCode(500, response);
                    }
                    Account current = await _context.Accounts.Where(a => a.UserName == profile.UserName).SingleOrDefaultAsync();
                    if (account == null)
                    {
                        return StatusCode(500, response);
                    }
                    if (profile.OptionName == "font") {
                        current.Font = profile.OptionValue;
                        _context.Update(current);
                        await _context.SaveChangesAsync();
                    } else if (profile.OptionName == "theme") {
                        current.Theme = profile.OptionValue;
                        _context.Update(current);
                        await _context.SaveChangesAsync();
                    } else if (profile.OptionName == "message") {
                        current.Message = profile.OptionValue;
                        _context.Update(current);
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
    }

}
