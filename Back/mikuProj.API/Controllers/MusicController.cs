
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using mikuProj.API.Data;
using mikuProj.API.Models;


namespace mikuProj.API.Controllers
{
     [Route("api/[controller]")]
    [ApiController]
    public class MusicController : ControllerBase
    {

        private readonly DataContext _context;

        public MusicController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Music>>> GetMusics()
        {
            // Use o Entity Framework para obter todos os itens da tabela "Musics"
            var musics = await _context.Musics.ToListAsync();

            // Verifique se há resultados
            if (musics == null || musics.Count == 0)
            {
                return NoContent(); // Retorna um código 204 (No Content) se não houver registros
            }

            return Ok(musics); // Retorna os registros encontrados com um código 200 (OK)
        }

        [HttpGet("{id}")]
         public Music GetById(int id){
            return _context.Musics.FirstOrDefault(music => music.SongId == id);
         }

        [HttpGet("{id}/favorite")]
        public ActionResult<bool> GetMusicFavorite(int id)
        {
            // Encontre a música com base no ID
            Music music = _context.Musics.Find(id);

            if (music == null)
            {
                return NotFound(); // Retorna 404 se a música não for encontrada
            }

            // Retorna o valor "Favorite" da música diretamente
            return Ok(music.Favorite);
        }

        // Endpoint para atualizar um item na tabela "Music" por ID
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMusic(int id, Music updatedMusic)
        {
            // Verifica se o ID fornecido é válido
            if (id != updatedMusic.SongId)
            {
                return BadRequest("O ID fornecido não corresponde ao ID do objeto.");
            }

            // Verifica se o registro existe na tabela "Musics"
            var existingMusic = await _context.Musics.FindAsync(id);

            if (existingMusic == null)
            {
                return NotFound("Registro não encontrado.");
            }

            try
            {
                // Atualiza as propriedades do registro existente com os valores fornecidos
                existingMusic.VideoId = updatedMusic.VideoId;
                existingMusic.Favorite = updatedMusic.Favorite;

                // Salva as alterações no banco de dados
                await _context.SaveChangesAsync();

                return NoContent(); // Retorna código 204 (No Content) para sucesso na atualização
            }
            catch (DbUpdateConcurrencyException)
            {
                // Trate aqui exceções de concorrência, se necessário
                return StatusCode(500, "Erro de concorrência ao atualizar o registro.");
            }
        }

        [HttpPost()]
        public async Task<ActionResult<Music>> AddMusic([FromBody] Music newMusic)
        {
            // Adicione a nova música ao contexto
            _context.Musics.Add(newMusic);

            // Salve as alterações no banco de dados
            await _context.SaveChangesAsync();

            // O valor de newMusic.songId foi atribuído automaticamente pelo banco de dados
            // Retorne o objeto criado com o código 201 (Created)
            return CreatedAtAction(nameof(GetById), new { id = newMusic.SongId }, newMusic);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMusic(int id)
        {
            // Verifica se o registro existe na tabela "Musics"
            var music = await _context.Musics.FindAsync(id);

            if (music == null)
            {
                return NotFound("Registro não encontrado.");
            }

            // Remove o registro do contexto
            _context.Musics.Remove(music);

            // Salve as alterações no banco de dados
            await _context.SaveChangesAsync();

            return NoContent(); // Retorna código 204 (No Content) para sucesso na exclusão
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

    }
}