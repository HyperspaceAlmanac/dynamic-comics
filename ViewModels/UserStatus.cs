using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.ViewModels
{
    public class UserStatus
    {
        public bool Authenticated { get; set; }
        public bool LoggedIn { get; set; }
        public string UserName { get; set; }
    }
}
