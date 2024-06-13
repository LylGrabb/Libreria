using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Libreria.Models;
using Libreria.Data;
using Libreria.Mapper;
using Libreria.Models.Dto;
using Microsoft.AspNetCore.JsonPatch;
using AutoMapper;
using System.Text;


namespace Libreria.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LibroAPIController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _db;

        public LibroAPIController(ApplicationDbContext db, IMapper m)
        {
            _db = db;
            _mapper = m;
        }


        [HttpGet]
        public IActionResult GetLibri()
        {
            var l = _db.Libri.Include(x => x.Scaffale);
            var libDTO = l.Select(x => _mapper.Map<LibroDTO>(x)).ToList();
            return Ok(libDTO);
        }


        [HttpGet("titolo/{titolo}", Name = "GetLibroByTitolo")]
        public IActionResult GetLibroByTitolo(string titolo)
        {
            if (string.IsNullOrWhiteSpace(titolo))
            {
                return BadRequest("Il titolo non può essere vuoto");
            }

            var libro = _db.Libri.FirstOrDefault(x => x.Titolo.Equals(titolo));
            if (libro == null)
            {
                return NotFound("Libro non trovato");
            }

            return Ok(libro);
        }

        [HttpGet("isbn/{isbn}", Name = "GetLibroByIsbn")]
        public IActionResult GetLibroByIsbn(string isbn)
        {
            if (string.IsNullOrWhiteSpace(isbn))
            {
                return BadRequest("L'ISBN non può essere vuoto");
            }

            var libro = _db.Libri.FirstOrDefault(x => x.Isbn == isbn);
            if (libro == null)
            {
                return NotFound("Libro non trovato");
            }

            return Ok(libro);
        }

        [HttpGet("genere/{genere}", Name = "GetLibroByGenere")]
        public IActionResult GetLibroByGenere(string genere)
        {
            if (string.IsNullOrWhiteSpace(genere))
            {
                return BadRequest("Il genere non può essere vuoto");
            }

            var libri = _db.Libri
                           .Where(x => x.Genere.Equals(genere))
                           .Select(lib => new LibroDTO
                           {
                               Titolo = lib.Titolo,
                               Autore = lib.Autore,
                               Genere = lib.Genere,
                               Pagine = lib.Pagine,
                               Isbn = lib.Isbn,
                               Url = lib.Url,
                               Prezzo = lib.Prezzo,
                               Descrizione = lib.Descrizione
                           })
                           .ToList();

            return Ok(libri);
        }

        [HttpPost("post", Name = "Create")]
        public IActionResult Create([FromBody] LibroDTO libro)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (_db.Libri.Any(x => x.Isbn == libro.Isbn))
            {
                return Conflict("Il libro con questo ISBN esiste già");
            }

            var scaffale = _db.Scaffali.FirstOrDefault(s => s.GenereS.ToLower() == libro.Genere.ToLower());
            if (scaffale == null)
            {
                scaffale = new Scaffal()
                {
                    GenereS = libro.Genere,
                    Libris = new List<Libro>()
                };
                _db.Scaffali.Add(scaffale);
                _db.SaveChanges();
            }

            Libro model = new()
            {
                Isbn = libro.Isbn,
                Titolo = libro.Titolo,
                Url = libro.Url,
                Autore = libro.Autore,
                Pagine = libro.Pagine,
                Descrizione = libro.Descrizione,
                Prezzo = libro.Prezzo,
                ScaffaleId = scaffale.IdS,
                Genere = libro.Genere
            };

            _db.Libri.Add(model);
            _db.SaveChanges();

            return CreatedAtAction("GetLibroByIsbn", new { isbn = libro.Isbn }, libro);
        }



        [HttpPut("{titolo}")]
        public IActionResult UpdateL(string titolo, [FromBody] LibroDTO libroDTO)
        {
            if (libroDTO == null || !titolo.Equals(libroDTO.Titolo, System.StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Dati non validi");
            }

            var libroEsistente = _db.Libri.AsNoTracking().FirstOrDefault(r => r.Titolo == titolo);
            if (libroEsistente == null)
            {
                return NotFound("Libro non trovato");
            }

            var libro = new Libro
            {
                Autore = libroDTO.Autore,
                Genere = libroDTO.Genere,
                Pagine = libroDTO.Pagine,
                Titolo = libroDTO.Titolo,
                Isbn = libroDTO.Isbn,
                Url = libroDTO.Url,
                Prezzo = libroDTO.Prezzo,
                Descrizione = libroDTO.Descrizione,
                ScaffaleId = libroDTO.ScaffaleId
            };

            _db.Libri.Update(libro);
            _db.SaveChanges();

            return NoContent();
        }

        [HttpPatch("{titolo}", Name = "UpdatePartialLibro")]
        public IActionResult UpdatePartialLibro(string titolo, [FromBody] JsonPatchDocument<LibroDTO> patchDTO)
        {
            if (patchDTO == null)
            {
                return BadRequest("PatchDocument è nullo");
            }

            var libro = _db.Libri.FirstOrDefault(x => x.Titolo == titolo);
            if (libro == null)
            {
                return NotFound("Libro non trovato");
            }

            var libroDTO = new LibroDTO
            {
                Autore = libro.Autore,
                Titolo = libro.Titolo,
                Pagine = libro.Pagine,
                Isbn = libro.Isbn,
                Genere = libro.Genere,
                Url = libro.Url,
                Prezzo = libro.Prezzo,
                Descrizione = libro.Descrizione
            };

            patchDTO.ApplyTo(libroDTO, ModelState);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            libro.Autore = libroDTO.Autore;
            libro.Genere = libroDTO.Genere;
            libro.Pagine = libroDTO.Pagine;
            libro.Titolo = libroDTO.Titolo;
            libro.Isbn = libroDTO.Isbn;
            libro.Url = libroDTO.Url;
            libro.Prezzo = libroDTO.Prezzo;
            libro.Descrizione = libroDTO.Descrizione;

            _db.Libri.Update(libro);
            _db.SaveChanges();

            return NoContent();
        }

        [HttpDelete("delete/isbn/{isbn}")]
        public IActionResult Rimuovi(string isbn)
        {
            if (string.IsNullOrWhiteSpace(isbn))
            {
                return BadRequest("L'ISBN non può essere vuoto");
            }

            var libro = _db.Libri.FirstOrDefault(x => x.Isbn == isbn);
            if (libro == null)
            {
                return NotFound("Libro non trovato");
            }

            _db.Libri.Remove(libro);
            _db.SaveChanges();

            return NoContent();
        }

        [HttpDelete("delete/titolo/{titolo}")]
        public IActionResult RimuoviPerTitolo(string titolo)
        {
            if (string.IsNullOrWhiteSpace(titolo))
            {
                return BadRequest("Il titolo non può essere vuoto");
            }

            var libro = _db.Libri.FirstOrDefault(x => x.Titolo == titolo);
            if (libro == null)
            {
                return NotFound("Libro non trovato");
            }

            _db.Libri.Remove(libro);
            _db.SaveChanges();

            return NoContent();
        }
    }
}