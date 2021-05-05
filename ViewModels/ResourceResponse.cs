using capstone.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.ViewModels
{
    public class ResourceResponse
    {
        public string Result { get; set; }
        public List<Resource> Common { get; set; }
        public List<Resource> User { get; set; }
    }
}
