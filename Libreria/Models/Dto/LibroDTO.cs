
namespace Libreria.Models.Dto
{
    public class LibroDTO
    {
        public string Titolo { get; set; }
        public string Genere { get; set; }
        public string Autore { get; set; }
        public string Isbn { get; set; }
        public int Pagine { get; set; }
        public string Url { get; set; }
        public double Prezzo { get; set; }
        public string Descrizione { get; set; }
        public int ScaffaleId { get; set; }
    }
}
