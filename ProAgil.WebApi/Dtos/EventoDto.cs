using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using ProAgil.Domain;

namespace ProAgil.WebApi.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }
        [Required(ErrorMessage="Campo Obrigatório")]    
        [StringLength(100, MinimumLength=3, ErrorMessage="Local de ter entra 3 e 100 caracters")]
        public string Local { get; set; }
        public string DataEvento { get; set; }
        [Required(ErrorMessage="O Tema deve ser preenchido")]
        public string Tema { get; set; }
        [Range(2,12000, ErrorMessage="Quantidade de pessoas deve ser entre 2 e 12000")]
        public int QtdPessoas { get; set; }
        public string ImgUrl { get; set; }
        [Phone]
        public string Telefone { get; set; }
        [EmailAddress]
        public string Email { get; set; } 
        public List<Lote> Lotes { get; set; }
        public List<RedeSocialDto> RedesSociais { get; set; }
        public List<PalestranteDto> Palestrantes { get; set; }
    }
}