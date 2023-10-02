using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using mikuProj.API.Data;

namespace mikuProj.API.Controllers
{
    [Route("api/search")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly DataContext _context;

        public SearchController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Search(string query){
            try
        {
            // Realize a lógica de busca com base na consulta (query)
            var results = _context.Search(query);

            // Retorne os resultados como JSON
            return Ok(results);
        }
        catch (Exception ex)
        {
            // Lide com erros, por exemplo, registrando-os ou retornando um status de erro
            return StatusCode(500, "Erro interno do servidor: " + ex.Message);
        }
        }

        [HttpGet("/playlist/favorites")]
        public IActionResult FavoritesPL(){
            try{
                var results = _context.PlaylistFavorites();

                return Ok(results);
            }
            catch (Exception ex){
                return StatusCode(500, "Internal Server Error" + ex.Message);
            }
        }

    }
}