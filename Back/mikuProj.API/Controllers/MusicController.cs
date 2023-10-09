
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using mikuProj.API.Data;
using mikuProj.API.Models;
using Newtonsoft.Json.Linq;



namespace mikuProj.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MusicController : ControllerBase
    {

        private readonly DataContext _context;
        private readonly string apiKey = "AIzaSyAOpHTEHw0fGKsk4qefNnl5VPJ78WhAtms";

        public MusicController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Music>>> GetMusics()
        {
            // Entity Framework get all items from "Musics" table
            var musics = await _context.Musics.ToListAsync();

            // Check results
            if (musics == null || musics.Count == 0)
            {
                return NoContent(); // Return 204 (No Content) if there is no content.
            }

                foreach (var music in musics)
            {
                music.Playlists = await _context.Playlists
                    .Where(p => p.Musics.Any(m => m.SongId == music.SongId))
                    .ToListAsync();
            }

            return Ok(musics); // Return all found with a 200 (OK)
        }

        [HttpGet("{id}")]
        public Music GetById(int id){
            return _context.Musics.FirstOrDefault(music => music.SongId == id);
         }

        [HttpGet("{id}/favorite")] // Get Favorite State by Id
        public ActionResult<bool> GetMusicFavorite(int id)
        {
            // Find music By Id
            Music music = GetById(id);

            if (music == null)
            {
                return NotFound(); // Return 404 if not found
            }

            // Return "Favorite"
            return Ok(music.Favorite);
        }
        [HttpGet("{videoId}/name")] // Get Music Name By Id
        public ActionResult<string> GetNameByVideoId(string videoId){
            Music music = _context.Musics.FirstOrDefault(music => music.VideoId == videoId);

            if (music == null)
            {
                return NotFound(); // Return 404 if not found
            }

            return Ok(music.VideoName);
         }

        // Endpoint to update a item on the table "Music" with ID
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMusic(int id, Music updatedMusic)
        {
            // Check if the ID is valid
            if (id != updatedMusic.SongId)
            {
                return BadRequest("O ID fornecido não corresponde ao ID do objeto.");
            }

            // Check if exists in "Musics"
            var existingMusic = await _context.Musics.FindAsync(id);

            if (existingMusic == null)
            {
                return NotFound("Registro não encontrado.");
            }

            try
            {
                // Update the propertys
                existingMusic.VideoId = updatedMusic.VideoId;
                existingMusic.Favorite = updatedMusic.Favorite;

                // Save all changes on the database
                await _context.SaveChangesAsync();

                return NoContent(); // Return 204 (No Content), Success.
            }
            catch (DbUpdateConcurrencyException)
            {
                // Exceptions
                return StatusCode(500, "Erro de concorrência ao atualizar o registro.");
            }
        }

        [HttpPost()]
        public async Task<ActionResult<Music>> AddMusic([FromBody] Music newMusic)
        {
            // Add the new music to the context
            _context.Musics.Add(newMusic);

            newMusic.VideoName = await GetVideoTitleAsync(newMusic.VideoId);

            string apiUrl = $"https://www.googleapis.com/youtube/v3/videos?id={newMusic.VideoId}&key={apiKey}&part=snippet,statistics";

            newMusic.UserUploaded = DateTime.Now;

            try
            {
                using (HttpClient client = new HttpClient())
                {
                    HttpResponseMessage response = await client.GetAsync(apiUrl);

                    if (response.IsSuccessStatusCode)
                    {
                        string json = await response.Content.ReadAsStringAsync();
                        var videoData = JObject.Parse(json);

                        if (videoData["items"] != null && videoData["items"].HasValues)
                        {
                            var statistics = videoData["items"][0]["statistics"];
                            var snippet = videoData["items"][0]["snippet"];
                            var thumb = videoData["items"][0]["snippet"]["thumbnails"]["default"];

                            newMusic.Views = statistics?["viewCount"]?.ToString();
                            newMusic.Language = snippet?["defaultAudioLanguage"]?.ToString();
                            newMusic.Channel = snippet?["channelTitle"]?.ToString();
                            newMusic.ChannelId = snippet?["channelId"]?.ToString();
                            newMusic.ThumbImgUrl = thumb?["url"]?.ToString();
                            
                            if (DateTime.TryParse(snippet?["publishedAt"]?.ToString(), out DateTime videoUploaded))
                            {
                                newMusic.VideoUploaded = videoUploaded;
                            }

                            newMusic.Description = snippet?["description"]?.ToString();
                        }
                        else
                        {
                            // Caso a resposta da API não contenha dados do vídeo
                            return BadRequest("Dados do vídeo não encontrados na resposta da API do YouTube.");
                        }
                    }
                    else
                    {
                        // Tratar outros códigos de status de erro da API do YouTube
                        throw new Exception($"Error retrieving video information. Status code: {response.StatusCode}");
                    }
                }
            }
            catch (Exception ex)
            {
                // Lidar com exceções relacionadas à chamada à API do YouTube
                return StatusCode(500, $"Erro ao acessar a API do YouTube: {ex.Message}");
            }

            await _context.SaveChangesAsync();

            // Return 201 (Created)
            return CreatedAtAction(nameof(GetById), new { id = newMusic.SongId }, newMusic);
        }



        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMusic(int id)
        {
            // Check if exists in "Musics"
            var music = await _context.Musics.FindAsync(id);

            if (music == null)
            {
                return NotFound("Registro não encontrado.");
            }

            // Remove the content
            _context.Musics.Remove(music);

            // Save Changes
            await _context.SaveChangesAsync();

            return NoContent(); // Return 204 (No Content), Successs
        }

        [HttpDelete("delete-all")]
        public async Task<IActionResult> DeleteAllMusics(){

            var allMusics = await _context.Musics.ToListAsync();

            if (!allMusics.Any())
            {
                return NotFound("Não há registros para excluir.");
            }

            _context.Musics.RemoveRange(allMusics);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<string> GetVideoTitleAsync(string videoId)
        {
            using (var httpClient = new HttpClient())
            {
        
            var apiUrl = $"https://www.googleapis.com/youtube/v3/videos?id={videoId}&key={apiKey}&part=snippet";
            
            try
                {
                    var response = await httpClient.GetAsync(apiUrl);
                    response.EnsureSuccessStatusCode();
                    
                    var json = await response.Content.ReadAsStringAsync();
                    dynamic data = Newtonsoft.Json.JsonConvert.DeserializeObject(json);
                    
                    // The video title is currently in data.items[0]
                    string videoTitle = data.items[0].snippet.title;
                    
                    return videoTitle;
                }
            catch (Exception ex)
                {
                    // Exceptions
                    return ex + ". Erro ao recuperar o título do vídeo";
                }
            }
        }

            
    }
}