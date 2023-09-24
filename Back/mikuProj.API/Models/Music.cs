using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace mikuProj.API.Models
{
    public class Music
    {
        public int songId { get; set; }
        public string videoId { get; set; }
        public bool favorite { get; set; }
    }
}