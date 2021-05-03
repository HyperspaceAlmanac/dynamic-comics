using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.ViewModels
{
    public class DonationObj
    {
        public string Artist { get; set; }
        public string Customer { get; set; }
        public double Amount { get; set; }
        public DateTime Date { get; set; }
        public string Comment { get; set; }
    }
}
