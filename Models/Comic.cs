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
        public string ArtistId { get; set; }
        [ForeignKey("ArtistId")]
        public ApplicationUser Artist { get; set; }

    }
}
