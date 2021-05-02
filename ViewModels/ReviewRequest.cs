using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.ViewModels
{
    public class ReviewRequest
    {
        // Need to do 1. Any User 2. Logged in User, 3. All reviews for series
        public string RequestType { get; set; }
        public string Target { get; set; }
    }
}
