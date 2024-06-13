using AutoMapper;
using Libreria.Models;
using Libreria.Models.Dto;

namespace Libreria.Mapper
{
    public class Mapp : Profile
    {
        public Mapp()
        {
            CreateMap<Libro, LibroDTO>();
            CreateMap<LibroDTO, Libro>();

            CreateMap<Scaffal, ScaffalDTO>();
            CreateMap<ScaffalDTO, Scaffal>();

        }
    }
}
