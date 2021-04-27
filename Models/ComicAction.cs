using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.Models
{
    public class ComicAction
    {
        [Key]
        public int Id { get; set; }
        public int Timing { get; set; }
        public bool IsTrigger { get; set; }
        public bool Transition { get; set; }
        public string ActionType { get; set; }
        
        public int PanelId { get; set; }
        [ForeignKey("PanelId")]
        public Panel Panel { get; set; }
        public int NextPanelId { get; set; }
        [ForeignKey("NextPanelId")]

        public Panel NextPanel { get; set; }

        [ForeignKey("Resource")]
        public int ResourceId { get; set; }
        public Resource Resource { get; set; }
    }
}
