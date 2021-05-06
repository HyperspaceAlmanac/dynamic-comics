using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.ViewModels
{
    public class CommentObj
    {
        public string Description { get; set; }
        public string Commentor { get; set; }
        public int PanelNumber { get; set; }
        public DateTime Time { get; set; }
    }
}
