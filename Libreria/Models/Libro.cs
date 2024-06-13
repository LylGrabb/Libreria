using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;



namespace Libreria.Models
{
    public class Libro
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        [Required]
        public string Isbn { get; set; }

        [Required]
        public string Titolo { get; set; }

        [Required]
        public string Genere { get; set; }

        [Required]
        public string Autore { get; set; }

        public int Pagine { get; set; }

        public string Url { get; set; }

        public double Prezzo { get; set; }

        public string Descrizione { get; set; }

        public int ScaffaleId { get; set; }
        public Scaffal? Scaffale { get; set; }
    }
}
