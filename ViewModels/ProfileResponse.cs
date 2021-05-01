using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.ViewModels
{
    public class ProfileResponse
    {
        public string LoggedInUser { get; set; }
        public string Theme { get; set; }
        public string Font { get; set; }
        public string Message { get; set; }
    }
}
