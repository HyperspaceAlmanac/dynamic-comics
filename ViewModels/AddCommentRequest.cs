using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.ViewModels
{
    public class AddCommentRequest
    {
        public int PanelId { get; set; }
        public int PanelNumber { get; set; }
        public string Description { get; set; }

    }
}
