using System.Collections.Generic;
using System.IO;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProAgil.Domain;
using ProAgil.Repository;
using ProAgil.WebApi.Dtos;

namespace ProAgil.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventoController : Controller
    {
        private readonly IProAgilRepository _repo;
        private readonly IMapper _mapper; 
        public EventoController(IProAgilRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;

        }

          // GET api/values/5
        [HttpGet]
        public async Task<IActionResult> Get()
        {
             try
            {
                var eventos = await _repo.GetAllEventoAsync(true);
                var results = _mapper.Map<IEnumerable<EventoDto>>(eventos);
                return Ok(results);                
            }
            catch (System.Exception ex)
            {
                
               return this.StatusCode(StatusCodes.Status500InternalServerError, $"Banco de dados falhou {ex.Message}");
            }
            
        }
 
        [HttpPost("upload")]
        public async Task<IActionResult> Upload()
        {
             try
            {   
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Resource","Images");             
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if(file.Length > 0){
                    var filename = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName;
                    var fullPath = Path.Combine(pathToSave, filename.Replace("\""," ").Trim());

                    using(var stream = new FileStream(fullPath, FileMode.Create)){
                        file.CopyTo(stream);
                    }
                }

                return Ok();                
            }
            catch (System.Exception ex)
            {                
               return this.StatusCode(StatusCodes.Status500InternalServerError, $"Banco de dados falhou {ex.Message}");
            }

            return BadRequest("Erro ao tenta acezar upload");
            
        }

        [HttpGet("{EventoId}")]
        public async Task<IActionResult> Get(int EventoId)
        {
             try
            {
                var evento = await _repo.GetEventoAsyncById(EventoId, true);
                var results = _mapper.Map<Evento>(evento);
                return Ok(results);                
            }
            catch (System.Exception)
            {
                
               return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }
            
        }
        
        [HttpGet("getByTema/{tema}")]
        public async Task<IActionResult> Get(string tema)
        {
             try
            {
                var eventos = await _repo.GetAllEventoAsyncByTema(tema, true);
                var results = _mapper.Map<IEnumerable<Evento>>(eventos);
                return Ok(results);                
            }
            catch (System.Exception)
            {
                
               return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }            
        }

        [HttpPost]
        public async Task<IActionResult> Post(EventoDto eventoDto)
        {
             try
            {
                var evento = _mapper.Map<Evento>(eventoDto);
               _repo.Add(evento);

               if(await _repo.SaveChangesAsync())
               {
                 return Created($"/api/evento/{evento.Id}", _mapper.Map<EventoDto>(evento));                
               }
            }
            catch (System.Exception)
            {                
               return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }
            return BadRequest();
        }

        [HttpPut("{EventoId}")]
        public async Task<IActionResult> Put(int eventoId, EventoDto eventoDto)
        {
             try
            {
                var evento = await _repo.GetEventoAsyncById(eventoId, false);
                if(evento == null) return NotFound();

                _mapper.Map(eventoDto, evento);
                _repo.Update(evento);

               if(await _repo.SaveChangesAsync())
               {
                 return Created($"/api/evento/{evento.Id}", _mapper.Map<EventoDto>(evento));                
               }
            }
            catch (System.Exception)
            { 
               return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }
            return BadRequest();
        }

        [HttpDelete("{EventoId}")]
        public async Task<IActionResult> Delete(int EventoId)
        {
             try
            {
                var evento = await _repo.GetEventoAsyncById(EventoId, false);
                if(evento == null) return NotFound();

               _repo.Delete(evento);

               if(await _repo.SaveChangesAsync())
               {
                 return Ok();                
               }
            }
            catch (System.Exception)
            {                
               return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }
            return BadRequest();
        }
    }
}