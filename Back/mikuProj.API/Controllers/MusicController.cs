using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using mikuProj.API.Models;

namespace mikuProj.API.Controllers
{
    public class MusicController
    {

        public IEnumerable<Music> _music = new Music[] {
                new Music() {                    
                    songId = 1,
                    videoId = "Mwgsi5Rz0_w",
                    favorite = false
                },
                new Music() {                    
                    songId = 2,
                    videoId = "OBqw818mQ1E",
                    favorite = false
                }
            };

        [HttpGet]
        public IEnumerable<Music> Get() {
            return _music;
        }

        [HttpGet("{id}")]
        public IEnumerable<Music> GetById(int id){
            return _music.Where(music => music.songId == id);
        }
    }
}