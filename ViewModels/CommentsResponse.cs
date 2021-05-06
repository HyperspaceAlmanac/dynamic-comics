using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.ViewModels
{
    public class CommentsResponse
    {
        public string Result { get; set; }
        public List<CommentObj> Comments { get; set; }
    }
}
