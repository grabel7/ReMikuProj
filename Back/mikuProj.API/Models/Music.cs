using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace mikuProj.API.Models
{
public class Music
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int SongId { get; set; }
    
    public string? VideoName { get; set; }
    public string? Description { get; set; }
    [DataType(DataType.DateTime)]
    public DateTime? VideoUploaded { get; set; }
    [Required]
    public required string VideoId { get; set; }
    public string? Channel { get; set; }
    public string? ChannelId { get; set; }
    public string? Views { get; set; }
    public string? Language { get; set; }
    public bool? Favorite { get; set; }
    [DataType(DataType.DateTime)]
    public DateTime? UserUploaded { get; set; }
}

public class FavoriteUpdateDto
{
    public bool Favorite { get; set; }
}


}