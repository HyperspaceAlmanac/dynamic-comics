using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.ViewModels
{
    public class PanelObj
    {
        public int Id { get; set; }
        public int Number { get; set; }
        public bool Start { get; set; }
        public List<ActionObj> Actions { get; set; } 
    }
}
