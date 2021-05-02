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
            ComicsResponse response = new ComicsResponse();
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
                    response.Theme = account.Theme;
                    response.Result = "Fail";
                    response.UserName = account.UserName;
                    if (request.RequestType == "all")
                    {
                        response.ComicObjects = await GetAllComics();
                    }
                    else if (request.RequestType == "history")
                    {
                        response.ComicObjects = await GetComicsHistory(account.Id);
                    }
                    else if (request.RequestType == "partial")
                    {
                        if (request.User == account.UserName)
                        {
                            response.ComicObjects = await GetOwnComics(account.Id);
                        }
                        else
                        {
                            Account author = await _context.Accounts.Where(a => a.UserName == request.User).SingleOrDefaultAsync();
                            if (author == null)
                            {
                                return StatusCode(400, response);
                            }
                            response.ComicObjects = await GetOtherWorks(author.Id);
                        }
                    }
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
        private async Task<double> GetAverageReviews(string comicName, int id)
        {
            int count = await _context.Reviews.Where(r => r.ComicId == id).Select(r => r.Stars).SumAsync();
            int numReviews = await _context.Reviews.Where(r => r.ComicId == id).CountAsync();
            if (numReviews == 0)
            {
                return 0;
            }
            else
            {
                return Math.Round((double) count / numReviews, 2);
            }
        }

        private async Task<int> GetNumComments(string comicName, int id)
        {
            int count = await _context.Comments.Include(c => c.Panel).Where(c => c.Panel.ComicId == id).CountAsync();
            return count;
        }

        private async Task<int> ComicToId(string comic)
        {
            return await _context.Comics.Where(c => c.Name == comic).Select(c => c.Id).FirstOrDefaultAsync();
        }
        private async Task<List<ComicObj>> GetAllComics()
        {
            List<ComicObj> result = await _context.Comics.Include(c => c.Artist).Include(c => c.ComicCover).Where(c => c.Published)
                .Select(c => new ComicObj {ComicName = c.Name, Author = c.Artist.UserName, GenreOne = c.PrimaryGenre,
                GenreTwo = c.SecondaryGenre, CoverURL = c.ComicCover.ImageURL}).ToListAsync();
            
            for (int i = 0; i < result.Count; i++)
            {
                int comicId = await ComicToId(result[i].ComicName);
                result[i].Rating = await GetAverageReviews(result[i].ComicName, comicId);
                result[i].NumComments = await GetNumComments(result[i].ComicName, comicId);
            }
            return result;
        }

        private async Task<List<ComicObj>> GetOwnComics(int id)
        {
            List<ComicObj> result = await _context.Comics.Include(c => c.Artist).Include(c => c.ComicCover).Where(c => c.ArtistId == id)
                .Select(c => new ComicObj
                {
                    ComicName = c.Name,
                    Author = c.Artist.UserName,
                    GenreOne = c.PrimaryGenre,
                    GenreTwo = c.SecondaryGenre,
                    CoverURL = c.ComicCover.ImageURL,
                    Published = c.Published
                }).ToListAsync();
            for (int i = 0; i < result.Count; i++)
            {
                int comicId = await ComicToId(result[i].ComicName);
                result[i].Rating = await GetAverageReviews(result[i].ComicName, comicId);
                result[i].NumComments = await GetNumComments(result[i].ComicName, comicId);
            }
            return result;
        }

        private async Task<List<ComicObj>> GetComicsHistory(int id)
        {
            List<ComicObj> result = await _context.ProgressTable.Include(p => p.Comic).Include(p => p.Account).Include(p => p.Panel)
                .Include(p => p.Comic.Artist).Include(p => p.Comic.ComicCover).Where(p => p.AccountId == id && !p.Panel.StartingPanel)
                .Select(p => new ComicObj
                {
                    ComicName = p.Comic.Name,
                    Author = p.Comic.Artist.UserName,
                    GenreOne = p.Comic.PrimaryGenre,
                    GenreTwo = p.Comic.SecondaryGenre,
                    CoverURL = p.Comic.ComicCover.ImageURL,
                    Progress = p.Panel.PanelNumber
                }).ToListAsync();
            for (int i = 0; i < result.Count; i++)
            {
                int comicId = await ComicToId(result[i].ComicName);
                result[i].Rating = await GetAverageReviews(result[i].ComicName, comicId);
                result[i].NumComments = await GetNumComments(result[i].ComicName, comicId);
            }
            return result;
        }

        private async Task<List<ComicObj>> GetOtherWorks(int id)
        {
            List<ComicObj> result = await _context.Comics.Include(c => c.Artist).Include(c => c.ComicCover).Where(c => c.ArtistId == id && c.Published)
                .Select(c => new ComicObj
                {
                    ComicName = c.Name,
                    Author = c.Artist.UserName,
                    GenreOne = c.PrimaryGenre,
                    GenreTwo = c.SecondaryGenre,
                    CoverURL = c.ComicCover.ImageURL,
                    Published = c.Published
                }).ToListAsync();
            for (int i = 0; i < result.Count; i++)
            {
                int comicId = await ComicToId(result[i].ComicName);
                result[i].Rating = await GetAverageReviews(result[i].ComicName, comicId);
                result[i].NumComments = await GetNumComments(result[i].ComicName, comicId);
            }
            return result;
        }
    }

}
