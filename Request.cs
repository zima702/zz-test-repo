using System;
using System.ComponentModel.DataAnnotations;

namespace CARMS.Api.Models
{
    public class Request
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string ClientName { get; set; }

        [Required]
        public string Status { get; set; }

        public DateTime SubmittedAt { get; set; }
    }
}
