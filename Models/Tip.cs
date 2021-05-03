using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.Models
{
    public class Tip
    {
        [Key]
        public int Id { get; set; }
        public double Amount { get; set; }
        public DateTime Date { get; set; }
        public string Message { get; set; }

        public int ArtistId { get; set; }
        [ForeignKey("ArtistId")]
        public Account Artist { get; set; }
        public int CustomerId { get; set; }
        [ForeignKey("CustomerId")]
        public Account Customer { get; set; }

    }
}
