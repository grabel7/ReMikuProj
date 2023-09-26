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
    
    [Required]
    public string VideoId { get; set; }
    public bool? Favorite { get; set; }
}

public class FavoriteUpdateDto
{
    public bool Favorite { get; set; }
}


}