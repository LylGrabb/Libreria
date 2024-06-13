using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Libreria.Models
{
    public class Scaffal
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IdS { get; set; }

        [Required]
        [MaxLength(50)]
        public string GenereS { get; set; }

        public List<Libro> Libris { get; set; }

    }
}
