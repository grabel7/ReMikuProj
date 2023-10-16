using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace mikuProj.API.Models
{
    public class Playlist
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PlaylistId { get; set; }
        public string? PlaylistImg { get; set; } 
        public required string Name { get; set; } 
        public List<Music> Musics { get; set; } = new List<Music>();

    }

    public class PlaylistCreateDto
{
    public required string Name { get; set; }
}
    public class PlaylistDto
    {
        public int PlaylistId { get; set; }
        public required string Name { get; set; }
        public string? PlaylistImg { get; set; } 
        public List<MusicDto>? Musics { get; set; }
    }

    public class MusicDto
    {
        public int SongId { get; set; }
        public string? VideoName { get; set; }
        public string? ThumbImgUrl { get; set; }
        public string? Description { get; set; }
        public DateTime? VideoUploaded { get; set; }
        public required string VideoId { get; set; }
        public string? Channel { get; set; }
        public string? ChannelId { get; set; }
        public string? Views { get; set; }
        public string? Language { get; set; }
        public bool? Favorite { get; set; }
        public DateTime? UserUploaded { get; set; }
    }

// Se você tiver mais propriedades em suas entidades, adicione-as ao DTO conforme necessário.

}