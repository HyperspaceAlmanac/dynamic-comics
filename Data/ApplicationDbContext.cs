using capstone.Models;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            
            base.OnModelCreating(builder);
            
            builder.Entity<IdentityRole>()
                .HasData(
                    new IdentityRole
                    {
                        Id = "0f3f8561-ba6a-4530-b5e4-9e66425089de",
                        Name = "User",
                        NormalizedName = "USER",
                        ConcurrencyStamp = "a0b6873b-bcfd-4880-8987-3a403620f5f2"
                    }
                );
            builder.Entity<Review>()
                .HasKey(review => new { review.ReviewerId, review.ComicId });
            builder.Entity<Progress>()
                .HasKey(progress => new { progress.ComicId, progress.AccountId });
            builder.Entity<Comment>()
                .HasKey(comment => new { comment.CommentorId, comment.PanelId });

            builder.Entity<Tip>()
                .HasOne(typeof(Account), "Artist")
                .WithMany()
                .HasForeignKey("ArtistId")
                .OnDelete(DeleteBehavior.Restrict);
            builder.Entity<Tip>()
                .HasOne(typeof(Account), "Customer")
                .WithMany()
                .HasForeignKey("CustomerId")
                .OnDelete(DeleteBehavior.Restrict);
            builder.Entity<ComicAction>()
                .HasOne(typeof(Panel), "Panel")
                .WithMany()
                .HasForeignKey("PanelId")
                .OnDelete(DeleteBehavior.Restrict);
            builder.Entity<ComicAction>()
                .HasOne(typeof(Panel), "NextPanel")
                .WithMany()
                .HasForeignKey("NextPanelId")
                .OnDelete(DeleteBehavior.Restrict);
            builder.Entity<Progress>()
                .HasOne(typeof(Panel), "Panel")
                .WithMany()
                .HasForeignKey("PanelId")
                .OnDelete(DeleteBehavior.Restrict);
            builder.Entity<Comic>()
                .HasOne(typeof(Account), "Artist")
                .WithMany()
                .HasForeignKey("ArtistId")
                .OnDelete(DeleteBehavior.Restrict);
        }

        public DbSet<Account> Accounts { get; set; }
        public DbSet<ComicAction> ComicActions { get; set; }
        public DbSet<Comic> Comics { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Panel> Panels { get; set; }
        public DbSet<Progress> ProgressTable { get; set; }
        public DbSet<Resource> Resources { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Tip> Tips { get; set; }
    }
}
