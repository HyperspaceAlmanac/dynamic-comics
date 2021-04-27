using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.Models
{
    public class Comic
    {
        [Key]
        public int Id { get; set; }
        public string Theme { get; set; }
        public bool Published { get; set; }
        [ForeignKey("ApplicationUser")]
        public int ArtistId { get; set; }
        public ApplicationUser Artist { get; set; }

    }
}
