using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.Models
{
    public class Progress
    {
        [ForeignKey("Comic")]
        public int ComicId { get; set; }
        public Comic Comic { get; set; }
        [ForeignKey("Account")]
        public int AccountId { get; set; }
        public Account Account { get; set; }
        [ForeignKey("Panel")]
        public int PanelId { get; set; }
        public Panel Panel { get; set; }
    }
}
