﻿using capstone.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.ViewModels
{
    public class ComicSeriesResponse
    {
        public string Result { get; set; }
        public string User { get; set; }
        public string Author { get; set; }
        public string Theme { get; set; }
        public string Font { get; set; }
        public bool Published { get; set; }
        public int CurrentPanelId { get; set; }
        public List<PanelObj> Panels { get; set; }
        public List<Resource> Resources { get; set; }
    }
}
