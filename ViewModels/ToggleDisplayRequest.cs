using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.ViewModels
{
    public class ToggleDisplayRequest
    {
        public string ComicName { get; set; }
        public bool Enabled { get; set; }
    }
}
