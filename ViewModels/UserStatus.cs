using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.ViewModels
{
    public class HomeResponse
    {
        public bool Authenticated { get; set; }
        public bool LoggedIn { get; set; }
        public string UserName { get; set; }
    }
}
