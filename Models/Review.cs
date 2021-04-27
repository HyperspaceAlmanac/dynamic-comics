using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.Models
{
    public class Review
    {
        public int Stars { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        [ForeignKey("Comic")]
        public int ComicId { get; set; }
        public Comic Comic { get; set; }
        [ForeignKey("Account")]
        public int ReviewerId { get; set; }
        public Account Reviewer { get; set; }
    }
}
