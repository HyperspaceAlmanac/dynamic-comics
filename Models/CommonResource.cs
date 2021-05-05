using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace capstone.Models
{
    public class CommonResource
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("Resource")]
        public int ResourceId { get; set; }
        public Resource Resource { get; set; }
    }
}
