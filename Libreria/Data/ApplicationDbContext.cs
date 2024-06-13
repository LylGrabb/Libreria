using Libreria.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Text;

namespace Libreria.Data
{

    public class ApplicationDbContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.EnableSensitiveDataLogging();
            base.OnConfiguring(optionsBuilder);
        }
        public DbSet<Scaffal> Scaffali { get; set; }
        public DbSet<Libro> Libri { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Libro>(entity =>
            {
                entity.Property(e => e.Isbn).IsRequired().HasColumnType("NVARCHAR(13)");
                entity.Property(e => e.Titolo).IsRequired().HasColumnType("NVARCHAR(MAX)");
                entity.Property(e => e.Genere).IsRequired().HasColumnType("NVARCHAR(MAX)");
                entity.Property(e => e.Autore).IsRequired().HasColumnType("NVARCHAR(MAX)");
                entity.Property(e => e.Url).IsRequired().HasColumnType("NVARCHAR(MAX)");
                entity.Property(e => e.Descrizione).HasColumnType("NVARCHAR(MAX)");
            });

            modelBuilder.Entity<Scaffal>()
                .HasMany(s => s.Libris)
                .WithOne(l => l.Scaffale)
                .HasForeignKey(l => l.ScaffaleId);

            var scaffaliData = System.IO.File.ReadAllLines("Scaffali.csv")
                .Skip(1)
                .Select(line => line.Split(';'))
                .Select(parts => new Scaffal
                {
                    IdS = int.Parse(parts[0]),
                    GenereS = parts[1]
                }).ToList();

            var libriData = System.IO.File.ReadAllLines("Libri.csv", Encoding.UTF8)
                .Skip(1)
                .Select(line => line.Split(';'))
                .Select(parts => new Libro
                {
                    Isbn = parts[3],
                    Titolo = parts[0],
                    Genere = parts[1],
                    Autore = parts[2],
                    Pagine = int.Parse(parts[4]),
                    Url = parts[5],
                    Prezzo = double.Parse(parts[6]),
                    Descrizione = parts.Length >= 8 ? parts[7] : string.Empty,
                    ScaffaleId = scaffaliData.FirstOrDefault(s => s.GenereS == parts[1])?.IdS ?? 0
                })
                .ToList();

            modelBuilder.Entity<Scaffal>().HasData(scaffaliData.ToList());
            modelBuilder.Entity<Libro>().HasData(libriData.ToList());

        }
    }
}