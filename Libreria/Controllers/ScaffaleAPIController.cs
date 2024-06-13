using AutoMapper;
using Libreria.Data;
using Libreria.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Libreria.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScaffaleAPIController : Controller
    {
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _db;

        public ScaffaleAPIController(ApplicationDbContext db, IMapper m)
        {
            _db = db;
            _mapper = m;
        }

        [HttpGet]
        public IActionResult GetScaffali()
        {
            var l = _db.Scaffali.Include(x => x.Libris);
            var S = l.Select(x => _mapper.Map<ScaffalDTO>(x)).ToList();
            return Ok(S);
        }
    }
}
