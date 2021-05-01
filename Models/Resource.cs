using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.Models
{
    public class Resource
    {
        public int Id { get; set; }
        public string ImageURL { get; set; }
        public int Layer { get; set; }
        public string Text { get; set; }
        public string ResourceType { get; set; }
    }
}
