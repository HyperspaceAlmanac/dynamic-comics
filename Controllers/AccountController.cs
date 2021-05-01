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
                else
                {
                    return StatusCode(400, response);
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
                        return StatusCode(400, response);
                    }
                    Account current = await _context.Accounts.Where(a => a.UserName == profile.CurrentProfile).SingleOrDefaultAsync();
                    if (account == null)
                    {
                        return StatusCode(400, response);
                    }
                    response.LoggedInUser = account.UserName;
                    response.Theme = current.Theme;
                    response.Font = current.Font;
                    response.Message = current.Message;
                }
                else
                {
                    return StatusCode(400, response);
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
                    if (profile.OptionName == "font")
                    {
                        current.Font = profile.OptionValue;
                        _context.Update(current);
                        await _context.SaveChangesAsync();
                    }
                    else if (profile.OptionName == "theme")
                    {
                        current.Theme = profile.OptionValue;
                        _context.Update(current);
                        await _context.SaveChangesAsync();
                    }
                    else if (profile.OptionName == "message")
                    {
                        current.Message = profile.OptionValue;
                        _context.Update(current);
                        await _context.SaveChangesAsync();
                    }
                    return Ok(response);

                }
                else
                {
                    return StatusCode(400, response);
                }
            }
            catch
            {
                return StatusCode(500, response);
            }
        }

        [HttpPut("CreateComic")]
        public async Task<IActionResult> CreateComic([FromBody] CreateComic request)
        {
            SimpleResponse response = new SimpleResponse() {Result = "Fail"};
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
                    Comic exists = await _context.Comics.Where(c => c.Name.ToLower() == request.Name.ToLower()).SingleOrDefaultAsync();
                    if (exists != null)
                    {
                        return Ok(response);
                    }
                    Comic comic = new Comic
                    {
                        ArtistId = account.Id,
                        Name = request.Name,
                        Published = false,
                        PrimaryGenre = request.GenreOne,
                        SecondaryGenre = request.GenreTwo,
                        ComicCoverId = 1 // Seeded value for grayDefault.png
                    };
                    _context.Add(comic);
                    await _context.SaveChangesAsync();
                    Panel panel = new Panel
                    {
                        ComicId = comic.Id,
                        PanelNumber = 1,
                        StartingPanel = true
                    };
                    _context.Add(panel);
                    await _context.SaveChangesAsync();
                    response.Result = "Success";
                    return Ok(response);
                }
                else
                {
                    return StatusCode(400, response);
                }
            }
            catch
            {
                return StatusCode(500, response);
            }
        }

        [HttpPut("GetComics")]
        public async Task<IActionResult> GetComics([FromBody] ComicsRequest request)
        {
            SimpleResponse response = new SimpleResponse() { Result = "Fail" };
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
                    if (request.RequestType == "all")
                    {
                    }
                    else if (request.RequestType == "history")
                    {
                    }
                    else if (request.RequestType == "userWorks")
                    {
                    }
                    else if (request.RequestType == "othersWorks")
                    {
                    }
                    return Ok(response);
                }
                else
                {
                    return StatusCode(400, response);
                }
            }
            catch
            {
                return StatusCode(500, response);
            }
        }
    }

}
