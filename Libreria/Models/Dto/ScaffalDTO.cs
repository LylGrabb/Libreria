using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Libreria.Models.Dto
{
    public class ScaffalDTO
    {
        public int IdS { get; set; }
        public string GenereS { get; set; }
        public List<LibroDTO>? Libris { get; set; }
    }
}
