using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using mikuProj.API.Data;
using mikuProj.API.Models;

namespace mikuProj.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlaylistController : ControllerBase
    {
        private readonly DataContext _context;
        public PlaylistController(DataContext context)
        {
            _context = context;
        }
        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PlaylistDto>>> GetPlaylists()
        {
            var playlists = await _context.Playlists
                .Include(p => p.Musics)
                .ToListAsync();

            if (playlists == null || playlists.Count == 0)
            {
                return NoContent();
            }

            var playlistsDto = playlists.Select(playlist => new PlaylistDto
            {
                PlaylistId = playlist.PlaylistId,
                Name = playlist.Name,
                Musics = playlist.Musics.Select(music => new MusicDto
                {
                    SongId = music.SongId,
                    VideoName = music.VideoName,
                    Description = music.Description,
                    VideoUploaded = music.VideoUploaded,
                    VideoId = music.VideoId,
                    Channel = music.Channel,
                    ChannelId = music.ChannelId,
                    Views = music.Views,
                    Language = music.Language,
                    Favorite = music.Favorite,
                    UserUploaded = music.UserUploaded
                }).ToList()
            }).ToList();

            return Ok(playlistsDto);
        }


        [HttpPost]
        public async Task<IActionResult> CreatePlaylist([FromBody] PlaylistCreateDto playlistCreateDto)
        {
            if (playlistCreateDto == null || string.IsNullOrWhiteSpace(playlistCreateDto.Name))
            {
                // Se o nome não for fornecido, defina-o como "My Random Playlist"
                playlistCreateDto.Name = "My Random Playlist";
            }

            // Crie uma nova instância da classe Playlist com o nome fornecido
            var novaPlaylist = new Playlist
            {
                Name = playlistCreateDto.Name,
                Musics = new List<Music>() // Inicialize a lista de músicas como vazia
            };

            // Adicione a playlist ao contexto de dados
            _context.Playlists.Add(novaPlaylist);

            try
            {
                // Salve as alterações no banco de dados
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpPost("{playlistId}/add-music/{songId}")]
        public async Task<IActionResult> AddMusicToPlaylist(int playlistId, int songId)
        {
            try
            {
                // Verifique se a playlist e a música existem
                var playlist = await _context.Playlists.FindAsync(playlistId);
                var music = await _context.Musics.FindAsync(songId);

                if (playlist == null || music == null)
                {
                    return NotFound("Song or Playlist Not Found.");
                }

                // Adicione a música à playlist
                playlist.Musics.Add(music);

                music.Playlists.Add(playlist);

                // Tente salvar as alterações no banco de dados
                await _context.SaveChangesAsync();
               
                return NoContent();
            }
            catch (Exception ex)
            {
                // Registre a exceção para fins de depuração
                Console.WriteLine($"Error adding to playlist: {ex}");

                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePlaylist(int id, [FromBody] PlaylistCreateDto playlistCreateDto){
           
            var playlist = await _context.Playlists.FindAsync(id);

            if (playlist == null)
            {
                return NotFound("Entry not found.");
            }

            playlist.Name = playlistCreateDto.Name;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
         public async Task<IActionResult> DeletePlaylist(int id){
             // Check if exists in "Playlists"
            var playlist = await _context.Playlists.FindAsync(id);

            if (playlist == null)
            {
                return NotFound("Entry not found.");
            }

            // Remove the content
            _context.Playlists.Remove(playlist);

            // Save Changes
            await _context.SaveChangesAsync();

            return NoContent(); // Return 204 (No Content), Successs
         }

        [HttpDelete("Delete-All")]
         public async Task<IActionResult> DeleteAllPlaylists(){

            var allPlaylists = await _context.Playlists.ToListAsync();

            if (!allPlaylists.Any())
            {
                return NotFound("There is no entry to delete.");
            }

            _context.Playlists.RemoveRange(allPlaylists);

            await _context.SaveChangesAsync();

            return NoContent(); 
         }

        [HttpDelete("{playlistId}/remove-music/{songId}")]
         public async Task<IActionResult> DeleteMusicFromPlaylist(int playlistId, int songId){

            try
            {
                // Verifique se a playlist e a música existem
                var playlist = await _context.Playlists.Include(p => p.Musics).FirstOrDefaultAsync(p => p.PlaylistId == playlistId);
                var music = await _context.Musics.Include(m => m.Playlists).FirstOrDefaultAsync(m => m.SongId == songId);


                if (playlist == null || music == null)
                {
                    return NotFound("Song or playlist not found.");
                }

                // Adicione a música à playlist
                playlist.Musics.Remove(music);

                music.Playlists.Remove(playlist);

                // Tente salvar as alterações no banco de dados
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                // Registre a exceção para fins de depuração
                Console.WriteLine($"Error adding to playlist: {ex}");

                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }

         }

    }
}