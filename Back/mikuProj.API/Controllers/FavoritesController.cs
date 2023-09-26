using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using mikuProj.API.Data;
using mikuProj.API.Models;

namespace mikuProj.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavoritesController : ControllerBase
    {
        private readonly DataContext _context;

        public FavoritesController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Music>>> GetFavorites()
        {
            // Use o Entity Framework para obter todos os itens da tabela "Musics"
            var favorites = await _context.Musics.Where(m => (bool)m.Favorite).ToListAsync();

            // Verifique se há resultados
            if (favorites == null || favorites.Count == 0)
            {
                return NoContent(); // Retorna um código 204 (No Content) se não houver registros
            }

            return Ok(favorites); // Retorna os registros encontrados com um código 200 (OK)
        }
        [HttpPut("ChangeFavorite/{id}")]
         public async Task<IActionResult> UpdateFavorite(int id, FavoriteUpdateDto favoriteUpdateDto)
        {
            // Verifica se o ID fornecido é válido
            /* if (id != favoriteUpdateDto.SongId)
            {
                return BadRequest("O ID fornecido não corresponde ao ID do objeto.");
            } */

            // Verifica se o registro existe na tabela "Musics"
            var existingMusic = await _context.Musics.FindAsync(id);

            if (existingMusic == null)
            {
                return BadRequest("Registro não encontrado.");
            }

            try
            {
                // Atualiza as propriedades do registro existente com os valores fornecidos
                existingMusic.Favorite = favoriteUpdateDto.Favorite;

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

    }
}