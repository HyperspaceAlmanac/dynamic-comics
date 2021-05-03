using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.ViewModels
{
    public class DonationsResponse
    {
        public string Result { get; set; }
        public List<DonationObj> Donations {get; set;}
    }
}
