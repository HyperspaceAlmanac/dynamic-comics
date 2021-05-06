using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.ViewModels
{
    public class UpdateActionsRequest
    {
        public string ComicName { get; set; }
        public int PanelId { get; set; }
        public int Number { get; set; }
        public bool Active { get; set; }
        public List<ActionObj> Actions { get; set; }

    }
}
