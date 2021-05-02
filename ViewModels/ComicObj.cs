using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.ViewModels
{
    public class ComicObj
    {
        public string ComicName { get; set; }
        public string Author { get; set; }
        public string CoverURL { get; set; }
        public string GenreOne { get; set; }
        public string GenreTwo { get; set; }
        public double Rating { get; set; }
        public int NumComments { get; set; }
        public int Progress { get; set; }
        public bool Published { get; set; }
    }
}
