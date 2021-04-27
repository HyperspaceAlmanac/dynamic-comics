using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.Models
{
    public class Panel
    {
        [Key]
        public int Id { get; set; }
        public int PanelNumber { get; set; }
        public bool StartingPanel { get; set; }
        [ForeignKey("Comic")]
        public int ComicId { get; set; }
        public Comic Comic { get; set; }
    }
}
