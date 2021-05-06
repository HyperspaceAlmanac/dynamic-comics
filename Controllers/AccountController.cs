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
using Newtonsoft.Json;
using Stripe;
using Stripe.Checkout;
using Microsoft.AspNetCore.Http;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace capstone.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        public ApplicationDbContext _context;
        private readonly string _resources = "ClientApp\\public\\images\\";
        public AccountController(ApplicationDbContext context)
        {
            _context = context;
            StripeConfiguration.ApiKey = Secrets.StripeSecretKey;
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
                    Models.Account account = await _context.Accounts.Where(a => a.ApplicationUserId == userId).SingleOrDefaultAsync();
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
                    Models.Account account = await _context.Accounts.Where(a => a.ApplicationUserId == userId).SingleOrDefaultAsync();
                    if (account == null)
                    {
                        return StatusCode(400, response);
                    }
                    Models.Account current = await _context.Accounts.Where(a => a.UserName == profile.CurrentProfile).SingleOrDefaultAsync();
                    if (current == null)
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
                    Models.Account account = await _context.Accounts.Where(a => a.ApplicationUserId == userId).SingleOrDefaultAsync();
                    if (account == null)
                    {
                        return StatusCode(500, response);
                    }
                    Models.Account current = await _context.Accounts.Where(a => a.UserName == profile.UserName).SingleOrDefaultAsync();
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
            SimpleResponse response = new SimpleResponse() { Result = "Fail" };
            try
            {
                if (User.Identity.IsAuthenticated)
                {
                    var userId = this.User.FindFirstValue("sub");
                    Models.Account account = await _context.Accounts.Where(a => a.ApplicationUserId == userId).SingleOrDefaultAsync();
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
                        StartingPanel = true,
                        Active = true
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
                    Models.Account account = await _context.Accounts.Where(a => a.ApplicationUserId == userId).SingleOrDefaultAsync();
                    if (account == null)
                    {
                        return StatusCode(500, response);
                    }
                    response.Theme = account.Theme;
                    response.Font = account.Font;
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
                            Models.Account author = await _context.Accounts.Where(a => a.UserName == request.User).SingleOrDefaultAsync();
                            if (author == null)
                            {
                                return StatusCode(400, response);
                            }
                            response.ComicObjects = await GetOtherWorks(author.Id);
                            response.Theme = author.Theme;
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

        [HttpPut("GetReviews")]
        public async Task<IActionResult> GetReviews([FromBody] ReviewRequest request)
        {
            ReviewResponse response = new ReviewResponse()
            {
                Result = "Fail"
            };
            try
            {
                if (User.Identity.IsAuthenticated)
                {
                    var userId = this.User.FindFirstValue("sub");
                    Models.Account account = await _context.Accounts.Where(a => a.ApplicationUserId == userId).SingleOrDefaultAsync();
                    if (account == null)
                    {
                        return StatusCode(500, response);
                    }
                    response.User = account.UserName;
                    if (request.RequestType == "User")
                    {
                        if (account.UserName == request.Target)
                        {
                            response.Reviews = await GetUserReviews(account.Id);
                        }
                        else
                        {
                            Models.Account user = await _context.Accounts.Where(a => a.UserName == request.Target).SingleOrDefaultAsync();
                            if (user == null)
                            {
                                return StatusCode(400, response);
                            }
                            response.Reviews = await GetUserReviews(user.Id);
                        }
                    }
                    else if (request.RequestType == "Comic")
                    {
                        Comic comic = await _context.Comics.Where(c => c.Name == request.Target).SingleOrDefaultAsync();
                        if (comic == null)
                        {
                            return StatusCode(400, response);
                        }
                        response.Reviews = await GetComicReviews(comic.Id, account.Id);
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
        [HttpPut("MakeDonation")]
        public async Task<IActionResult> MakeDonation([FromBody] DonationRequest request)
        {
            SimpleResponse response = new SimpleResponse();
            response.Result = "Fail";

            try
            {
                var userId = this.User.FindFirstValue("sub");
                Models.Account account = await _context.Accounts.Where(a => a.ApplicationUserId == userId).SingleOrDefaultAsync();
                if (account == null) {
                    return StatusCode(400, response);
                }
                Models.Account artist = await _context.Accounts.Where(a => a.UserName == request.User).SingleOrDefaultAsync();
                if (artist == null)
                {
                    return StatusCode(400, response);
                }
                double donationValue = Convert.ToDouble(request.Amount);
                long cents = Convert.ToInt64( donationValue* 100);
                var options = new ChargeCreateOptions
                {
                    Amount = cents,
                    Currency = "usd",
                    Source = request.TokenId,
                    Description = $"Donation from {account.UserName} to {request.User}"
                };

                var service = new ChargeService();
                Charge charge = service.Create(options);
                if (charge.Status == "succeeded")
                {
                    Tip donation = new Tip
                    {
                        Date = DateTime.Now,
                        Amount = donationValue,
                        Message = request.Message,
                        CustomerId = account.Id,
                        ArtistId = artist.Id
                    };
                    await _context.AddAsync(donation);
                    await _context.SaveChangesAsync();
                    response.Result = "Success";
                    return Ok(response);
                }
                else
                {
                    return StatusCode(500, response);
                }
            }
            catch
            {
                return StatusCode(500, response);
            }
        }

        [HttpPut("GetDonations")]
        public async Task<IActionResult> GetDonations([FromBody] DonationsRequest request)
        {
            DonationsResponse response = new DonationsResponse()
            {
                Result = "Fail"
            };
            try
            {
                if (User.Identity.IsAuthenticated)
                {
                    var userId = this.User.FindFirstValue("sub");
                    Models.Account account = await _context.Accounts.Where(a => a.ApplicationUserId == userId).SingleOrDefaultAsync();
                    if (account == null)
                    {
                        return StatusCode(500, response);
                    }
     
                    response.Donations = await GetAllDonations(account.Id, request.ReceivedDonations);
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

        [HttpPut("GetReview")]
        public async Task<IActionResult> GetReview([FromBody] ReviewRequest request)
        {
            ReviewResponse response = new ReviewResponse()
            {
                Result = "Fail"
            };
            try
            {
                if (User.Identity.IsAuthenticated)
                {
                    var userId = this.User.FindFirstValue("sub");
                    Models.Account account = await _context.Accounts.Where(a => a.ApplicationUserId == userId).SingleOrDefaultAsync();
                    if (account == null)
                    {
                        return StatusCode(500, response);
                    }
                    Models.Review review = await _context.Reviews.Include(r => r.Comic)
                        .Where(r => r.ReviewerId == account.Id && r.Comic.Name == request.Target).SingleOrDefaultAsync();
                    if (review == null)
                    {
                        response.Reviews = new List<ReviewObj>();
                    }
                    else
                    {
                        response.Reviews = new List<ReviewObj>() {
                            new ReviewObj {
                                Name = review.Comic.Name,
                                Author = account.UserName,
                                PersonalRating = review.Stars,
                                Description = review.Description,
                                Date = review.Date
                            }
                        };
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

        [HttpPut("PostReview")]
        public async Task<IActionResult> PostReview([FromBody] PostReviewRequest request)
        {
            ReviewResponse response = new ReviewResponse()
            {
                Result = "Fail"
            };
            try
            {
                if (User.Identity.IsAuthenticated)
                {
                    var userId = this.User.FindFirstValue("sub");
                    Models.Account account = await _context.Accounts.Where(a => a.ApplicationUserId == userId).SingleOrDefaultAsync();
                    if (account == null)
                    {
                        return StatusCode(500, response);
                    }
                    Models.Review review = await _context.Reviews.Include(r => r.Comic)
                        .Where(r => r.ReviewerId == account.Id && r.Comic.Name == request.ComicSeries).SingleOrDefaultAsync();
                    if (review == null)
                    {
                        Comic comic = await _context.Comics.Where(c => c.Name == request.ComicSeries).SingleOrDefaultAsync();
                        if (comic == null) {
                            return StatusCode(400, response);
                        }
                        review = new Models.Review()
                        {
                            ComicId = comic.Id,
                            ReviewerId = account.Id
                        };
                        await _context.AddAsync(review);
                        await _context.SaveChangesAsync();
                    }
                    review.Stars = request.Rating;
                    review.Description = request.Description;
                    review.Date = DateTime.Now;

                    _context.Update(review);
                    await _context.SaveChangesAsync();

                    response.Reviews = new List<ReviewObj>() {
                        new ReviewObj {
                            Name = review.Comic.Name,
                            Author = account.UserName,
                            PersonalRating = review.Stars,
                            Description = review.Description,
                            Date = review.Date
                        }
                    };
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

        [HttpGet("GetResources")]
        public async Task<IActionResult> GetResources()
        {
            ResourceResponse response = new ResourceResponse()
            {
                Result = "Fail"
            };
            try
            {
                var userId = this.User.FindFirstValue("sub");
                Models.Account account = await _context.Accounts.Where(a => a.ApplicationUserId == userId).SingleOrDefaultAsync();
                if (account == null)
                {
                    return StatusCode(500, response);
                }

                response.User = await _context.UserResources.Include(ur => ur.Resource).Where(ur => ur.AccountId == account.Id).Select(ur => ur.Resource).ToListAsync();
                response.Common = await _context.CommonResources.Include(cr => cr.Resource).Select(cr => cr.Resource).ToListAsync();
                response.Result = "Success";
                return Ok(response);
            }
            catch
            {
                return StatusCode(500, response);
            }
        }

        [HttpPut("PostTextResource")]
        public async Task<IActionResult> PostTextResource([FromBody] PostReviewRequest request)
        {
            ReviewResponse response = new ReviewResponse()
            {
                Result = "Fail"
            };
            try
            {
                if (User.Identity.IsAuthenticated)
                {
                    var userId = this.User.FindFirstValue("sub");
                    Models.Account account = await _context.Accounts.Where(a => a.ApplicationUserId == userId).SingleOrDefaultAsync();
                    if (account == null)
                    {
                        return StatusCode(500, response);
                    }
                    Models.Review review = await _context.Reviews.Include(r => r.Comic)
                        .Where(r => r.ReviewerId == account.Id && r.Comic.Name == request.ComicSeries).SingleOrDefaultAsync();
                    if (review == null)
                    {
                        Comic comic = await _context.Comics.Where(c => c.Name == request.ComicSeries).SingleOrDefaultAsync();
                        if (comic == null)
                        {
                            return StatusCode(400, response);
                        }
                        review = new Models.Review()
                        {
                            ComicId = comic.Id,
                            ReviewerId = account.Id
                        };
                        await _context.AddAsync(review);
                        await _context.SaveChangesAsync();
                    }
                    review.Stars = request.Rating;
                    review.Description = request.Description;
                    review.Date = DateTime.Now;

                    _context.Update(review);
                    await _context.SaveChangesAsync();

                    response.Reviews = new List<ReviewObj>() {
                        new ReviewObj {
                            Name = review.Comic.Name,
                            Author = account.UserName,
                            PersonalRating = review.Stars,
                            Description = review.Description,
                            Date = review.Date
                        }
                    };
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

        [HttpPut("PostThumbnail")]
        public async Task<IActionResult> PostThumbnail()
        {
            SimpleResponse response = new SimpleResponse()
            {
                Result = "Fail"
            };
            try
            {
                var userId = this.User.FindFirstValue("sub");
                Models.Account account = await _context.Accounts.Where(a => a.ApplicationUserId == userId).SingleOrDefaultAsync();
                if (account == null)
                {
                    return StatusCode(500, response);
                }
                string comicName = Request.Form["comic"];

                Resource resource = new Resource
                {
                    ResourceType = "image",
                };
                await _context.AddAsync(resource);
                await _context.SaveChangesAsync();

                // Create Resource and add to DB first
                var file = Request.Form.Files[0];
                resource.ImageURL = $"{account.Id}.{resource.Id}.{file.FileName}";


                _context.Update(resource);
                await _context.SaveChangesAsync();

                Comic comic = await _context.Comics.Where(c => c.Name == comicName).SingleOrDefaultAsync();
                if (comic == null)
                {
                    return StatusCode(400, response);
                }
                comic.ComicCoverId = resource.Id;
                _context.Update(comic);
                await _context.SaveChangesAsync();

                using (var stream = System.IO.File.Create(_resources + resource.ImageURL))
                {
                    await file.CopyToAsync(stream);
                    stream.Close();
                }
                UserResource userResource = new UserResource
                {
                    AccountId = account.Id,
                    ResourceId = resource.Id
                };
                await _context.AddAsync(userResource);
                await _context.SaveChangesAsync();

                response.Result = "Success";
                return Ok(response);
            }
            catch
            {
                return StatusCode(500, response);
            }
        }

        [HttpPut("PostResource")]
        public async Task<IActionResult> PostResource()
        {
            ResourceResponse response = new ResourceResponse()
            {
                Result = "Fail"
            };
            try
            {
                var userId = this.User.FindFirstValue("sub");
                Models.Account account = await _context.Accounts.Where(a => a.ApplicationUserId == userId).SingleOrDefaultAsync();
                if (account == null)
                {
                    return StatusCode(500, response);
                }
                

                Resource resource = new Resource
                {
                    ResourceType = "image",
                };
                await _context.AddAsync(resource);
                await _context.SaveChangesAsync();

                // Create Resource and add to DB first
                var file = Request.Form.Files[0];
                resource.ImageURL = $"{account.Id}.{resource.Id}.{file.FileName}";

                
                _context.Update(resource);
                await _context.SaveChangesAsync();

                using (var stream = System.IO.File.Create(_resources + resource.ImageURL))
                {
                    await file.CopyToAsync(stream);
                    stream.Close();
                }
                bool shared = Request.Form["Common"] == "yes";
                if (shared)
                {
                    CommonResource commonResource = new CommonResource
                    {
                        ResourceId = resource.Id
                    };
                    await _context.AddAsync(commonResource);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    UserResource userResource = new UserResource
                    {
                        AccountId = account.Id,
                        ResourceId = resource.Id
                    };
                    await _context.AddAsync(userResource);
                    await _context.SaveChangesAsync();
                }

                
                response.User = await _context.UserResources.Include(ur => ur.Resource).Where(ur => ur.AccountId == account.Id).Select(ur => ur.Resource).ToListAsync();
                response.Common = await _context.CommonResources.Include(cr => cr.Resource).Select(cr => cr.Resource).ToListAsync();
                response.Result = "Success";
                return Ok(response);
            }
            catch
            {
                return StatusCode(500, response);
            }
        }

        [HttpPut("GetComicSeries")]
        public async Task<IActionResult> GetComicSeries([FromBody] ComicSeriesRequest request)
        {
            ComicSeriesResponse response = new ComicSeriesResponse()
            {
                Result = "Fail"
            };
            try
            {
                if (User.Identity.IsAuthenticated)
                {
                    var userId = this.User.FindFirstValue("sub");
                    Models.Account account = await _context.Accounts.Where(a => a.ApplicationUserId == userId).SingleOrDefaultAsync();
                    if (account == null)
                    {
                        return StatusCode(400, response);
                    }
                    response = await PopulateComicSeriesResponse(account, request.ComicName, request.Edit);
                    if (!request.Edit)
                    {
                        Progress progress = await _context.ProgressTable.Include(p => p.Comic)
                            .Where(p => p.AccountId == account.Id && p.Comic.Name == request.ComicName).SingleOrDefaultAsync();
                        if (progress == null)
                        {
                            Panel panel = await _context.Panels.Include(p => p.Comic)
                                .Where(p => p.StartingPanel && p.Comic.Name == request.ComicName).SingleOrDefaultAsync();
                            if (panel == null)
                            {
                                return StatusCode(400, response);
                            }
                            response.CurrentPanelId = panel.Id;
                        }
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
        private async Task<ComicSeriesResponse> PopulateComicSeriesResponse(Models.Account account, string comicName, bool edit)
        {
            ComicSeriesResponse response = new ComicSeriesResponse()
            {
                Result = "Fail"
            };
            Tuple<Models.Account, Comic> values = await _context.Comics.Include(c => c.Artist).Where(c => c.Name == comicName)
                        .Select(c => new Tuple<Models.Account, Comic>(c.Artist, c)).SingleOrDefaultAsync();
            if (values != null && values.Item1 != null && values.Item2 != null)
            {
                response.Author = values.Item1.UserName;
                response.User = account.UserName;
                response.Theme = values.Item1.Theme;
                response.Font = values.Item1.Font;
                response.Panels = await GetAllPanels(values.Item2.Id, edit);
                response.Published = values.Item2.Published;
            }
            response.Result = "Success";
            return response;
        }

        [HttpPut("ToggleVisibility")]
        public async Task<IActionResult> ToggleDisplay([FromBody] ToggleDisplayRequest request)
        {
            SimpleResponse response = new SimpleResponse()
            {
                Result = "Fail"
            };
            try
            {
                if (User.Identity.IsAuthenticated)
                {
                    var userId = this.User.FindFirstValue("sub");
                    Models.Account account = await _context.Accounts.Where(a => a.ApplicationUserId == userId).SingleOrDefaultAsync();
                    if (account == null)
                    {
                        return StatusCode(400, response);
                    }
                    // Update Panels
                    Comic comic = await _context.Comics.Where(c => c.Name == request.ComicName).SingleOrDefaultAsync();
                    if (comic == null)
                    {
                        return StatusCode(400, response);
                    }
                    comic.Published = request.Enabled;
                    _context.Update(comic);
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

        [HttpPut("UpdatePanels")]
        public async Task<IActionResult> UpdatePanels([FromBody] UpdatePanelsRequest request)
        {
            ComicSeriesResponse response = new ComicSeriesResponse()
            {
                Result = "Fail"
            };
            try
            {
                if (User.Identity.IsAuthenticated)
                {
                    var userId = this.User.FindFirstValue("sub");
                    Models.Account account = await _context.Accounts.Where(a => a.ApplicationUserId == userId).SingleOrDefaultAsync();
                    if (account == null)
                    {
                        return StatusCode(400, response);
                    }
                    // Update Panels
                    Comic comic = await _context.Comics.Where(c => c.Name == request.ComicName).SingleOrDefaultAsync();
                    if (comic == null)
                    {
                        return StatusCode(400, response);
                    }
                    PanelObj temp;
                    Panel tempPanel;
                    for (int i = 0; i < request.Panels.Count; i++)
                    {
                        temp = request.Panels[i];
                        if (temp.Id == 0)
                        {
                            tempPanel = new Panel()
                            {
                                ComicId = comic.Id,
                                StartingPanel = false,
                                Active = temp.Active,
                                PanelNumber = temp.Number
                            };
                            await _context.AddAsync(tempPanel);
                            await _context.SaveChangesAsync();
                        }
                        else
                        {
                            tempPanel = await _context.Panels.Where(p => p.Id == temp.Id).SingleOrDefaultAsync();
                            if (tempPanel != null)
                            {
                                tempPanel.Active = temp.Active;
                                tempPanel.PanelNumber = temp.Number;
                                _context.Update(tempPanel);
                                await _context.SaveChangesAsync();
                            }
                        }
                    }

                    response = await PopulateComicSeriesResponse(account, request.ComicName, true);
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

        [HttpPut("UpdateActions")]
        public async Task<IActionResult> UpdateActions([FromBody] UpdateActionsRequest request)
        {
            //ComicSeriesResponse response = new ComicSeriesResponse()
            ComicSeriesResponse response = new ComicSeriesResponse()
            {
                Result = "Fail"
            };
            try
            {
                if (User.Identity.IsAuthenticated)
                {
                    var userId = this.User.FindFirstValue("sub");
                    Models.Account account = await _context.Accounts.Where(a => a.ApplicationUserId == userId).SingleOrDefaultAsync();
                    if (account == null)
                    {
                        return StatusCode(500, response);
                    }

                    Comic comic = await _context.Comics.Where(c => c.Name == request.ComicName).SingleOrDefaultAsync();
                    if (comic == null)
                    {
                        return StatusCode(400, response);
                    }
                    Panel panel = await _context.Panels.Where(p => p.Id == request.PanelId).SingleOrDefaultAsync();
                    if (panel == null)
                    {
                        return StatusCode(400, response);
                    }
                    panel.PanelNumber = request.Number;
                    panel.Active = request.Active;
                    _context.Update(panel);
                    await _context.SaveChangesAsync();

                    ActionObj temp;
                    ComicAction tempAction;
                    for (int i = 0; i < request.Actions.Count; i++)
                    {
                        temp = request.Actions[i];
                        if (temp.Id == 0)
                        {
                            tempAction = new ComicAction()
                            {
                                ActionType = temp.ActionType,
                                Active = temp.Active,
                                IsTrigger = temp.IsTrigger,
                                Layer = temp.Layer,
                                Options = temp.Options,
                                Priority = temp.Priority,
                                Timing = temp.Timing,
                                Transition = temp.Transition,
                                NextPanelId = temp.NextPanelId,
                                PanelId = temp.PanelId,
                                ResourceId = temp.ResourceId
                            };
                            await _context.AddAsync(tempAction);
                            await _context.SaveChangesAsync();
                        }
                        else
                        {
                            tempAction = await _context.ComicActions.Include(ca => ca.Panel)
                                .Where(ca => ca.Id == temp.Id && ca.Panel.ComicId == comic.Id).SingleOrDefaultAsync();
                            if (tempAction != null)
                            {
                                tempAction.ActionType = temp.ActionType;
                                tempAction.Active = temp.Active;
                                tempAction.IsTrigger = temp.IsTrigger;
                                tempAction.Layer = temp.Layer;
                                tempAction.Options = temp.Options;
                                tempAction.Priority = temp.Priority;
                                tempAction.Timing = temp.Timing;
                                tempAction.Transition = temp.Transition;
                                tempAction.NextPanelId = temp.NextPanelId;
                                tempAction.PanelId = temp.PanelId;
                                tempAction.ResourceId = temp.ResourceId;
                                await _context.SaveChangesAsync();
                            }
                        }
                    }

                    // Logic for processing request
                    response = await PopulateComicSeriesResponse(account, request.ComicName, true);

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

        private async Task<List<PanelObj>> GetAllPanels(int id, bool edit)
        {
            List<PanelObj> panels = await _context.Panels.Where(p => p.ComicId == id
                &&(edit || p.Active)).OrderByDescending(p => p.Active).ThenBy(p => p.PanelNumber)
                .Select(p => new PanelObj { Id = p.Id, Active = p.Active, Start = p.StartingPanel, Number = p.PanelNumber }).ToListAsync();
            for (int i = 0; i < panels.Count; i++)
            {
                panels[i].Actions = await GetAction(panels[i].Id, edit);
            }
            return panels;
        }

        private async Task<List<ActionObj>> GetAction(int id, bool edit)
        {
            List<ActionObj> actions = await _context.ComicActions.Where(ca => ca.PanelId == id && (edit || ca.Active))
                .OrderByDescending(ca => ca.Active).ThenBy(ca => ca.Timing).ThenBy(ca => ca.Priority)
                .Select(ca => new ActionObj
                {
                    Id = ca.Id,
                    ActionType = ca.ActionType,
                    Active = ca.Active,
                    IsTrigger = ca.IsTrigger,
                    Layer = ca.Layer,
                    NextPanelId = ca.NextPanelId,
                    Options = ca.Options,
                    PanelId = ca.PanelId,
                    Priority = ca.Priority,
                    ResourceId = ca.ResourceId,
                    Timing = ca.Timing,
                    Transition = ca.Transition
                }).ToListAsync();
            return actions;
        }

        private async Task<List<DonationObj>> GetAllDonations(int id, bool received)
        {
            return await _context.Tips.Include(t => t.Artist).Include(t => t.Customer)
                .Where(t => received ? t.ArtistId == id : t.CustomerId == id).Select(t =>
                new DonationObj {
                    Artist = t.Artist.UserName,
                    Customer = t.Customer.UserName,
                    Amount = t.Amount,
                    Comment = t.Message,
                    Date = t.Date
                }).ToListAsync();
        }

        private async Task<List<ReviewObj>> GetUserReviews(int id) {
            List<ReviewObj> reviews = await _context.Reviews.Include(r => r.Comic).Include(r => r.Reviewer).Where(r => r.ReviewerId == id)
                .Select(r => new ReviewObj {Name = r.Comic.Name, Date = r.Date, Description = r.Description,
                PersonalRating = r.Stars, Author = r.Comic.Artist.UserName}).ToListAsync();
            for (int i = 0; i < reviews.Count; i++)
            {
                int comicId = await ComicToId(reviews[i].Name);
                reviews[i].AverageRating = await GetAverageReviews(comicId);
            }
            return reviews;
        }

        private async Task<List<ReviewObj>> GetComicReviews(int id, int userId)
        {
            List<ReviewObj> reviews = await _context.Reviews.Include(r => r.Comic).Include(r => r.Reviewer).Where(r => r.ComicId == id && r.ReviewerId != userId)
                .Select(r => new ReviewObj
                {
                    Name = r.Comic.Name,
                    Author = r.Reviewer.UserName,
                    Date = r.Date,
                    Description = r.Description,
                    PersonalRating = r.Stars
                }).ToListAsync();
            return reviews;
        }

        private async Task<double> GetAverageReviews(int id)
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

        private async Task<int> GetNumComments(int id)
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
                result[i].Rating = await GetAverageReviews(comicId);
                result[i].NumComments = await GetNumComments(comicId);
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
                result[i].Rating = await GetAverageReviews(comicId);
                result[i].NumComments = await GetNumComments(comicId);
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
                result[i].Rating = await GetAverageReviews(comicId);
                result[i].NumComments = await GetNumComments(comicId);
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
                result[i].Rating = await GetAverageReviews(comicId);
                result[i].NumComments = await GetNumComments(comicId);
            }
            return result;
        }
    }

}
