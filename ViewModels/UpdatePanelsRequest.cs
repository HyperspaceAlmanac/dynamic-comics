using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.ViewModels
{
    public class UpdatePanelsRequest
    {
        public string ComicName { get; set; }
        public List<PanelObj> Panels { get; set; }
    }
}
