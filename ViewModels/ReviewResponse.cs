using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.ViewModels
{
    public class ReviewResponse
    {
        public string Result { get; set; }
        public string User { get; set; }
        public List<ReviewObj> Reviews { get; set; }
    }
}
