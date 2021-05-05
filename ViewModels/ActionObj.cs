using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.ViewModels
{
    public class ActionObj
    {
        public int Id { get; set; }
        public int Timing { get; set; }
        public bool IsTrigger { get; set; }
        public bool Transition { get; set; }
        public string ActionType { get; set; }
        public string Options { get; set; }
        public int Layer { get; set; }
        public int Priority { get; set; }

        public int PanelId { get; set; }
        public int NextPanelId { get; set; }
        
        public int ResourceId { get; set; }
    }
}
