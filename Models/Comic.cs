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
        public string PrimaryGenre { get; set; }
        public string SecondaryGenre { get; set; }
        public int ArtistId { get; set; }
        [ForeignKey("ArtistId")]
        public Account Artist { get; set; }
        public int ComicCoverId { get; set; }
        [ForeignKey("ComicCoverId")]
        public Resource ComicCover { get; set; }
        

    }
}
