using Microsoft.AspNetCore.Mvc;
using CARMS.Api.Models;
using CARMS.Api.DTOs;
using CARMS.Api.Services;

namespace CARMS.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RequestController : ControllerBase
    {
        private readonly IRequestService _requestService;

        public RequestController(IRequestService requestService)
        {
            _requestService = requestService;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var requests = _requestService.GetAllRequests();
            return Ok(requests);
        }

        [HttpPost]
        public IActionResult CreateRequest(CreateRequestDto requestDto)
        {
            var newRequest = _requestService.CreateRequest(requestDto);
            return CreatedAtAction(nameof(GetAll), new { id = newRequest.Id }, newRequest);
        }
    }
}
