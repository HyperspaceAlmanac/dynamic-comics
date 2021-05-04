using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.ViewModels
{
    public class PostReviewRequest
    {
        public string ComicSeries { get; set; }
        public int Rating { get; set; }
        public string Description { get; set; }
    }
}
