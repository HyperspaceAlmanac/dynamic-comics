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
        public int ReviewerId { get; set; }
        [ForeignKey("ReviewerId")]
        public Account Reviewer { get; set; }
    }
}
