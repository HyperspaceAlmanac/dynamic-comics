using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.ViewModels
{
    public class ReviewObj
    {
        public string Name { get; set; }
        public string Author { get; set; }
        public int PersonalRating { get; set; }
        public double AverageRating { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
    }
}
