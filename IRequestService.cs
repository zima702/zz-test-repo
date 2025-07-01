using System.Collections.Generic;
using CARMS.Api.Models;
using CARMS.Api.DTOs;

namespace CARMS.Api.Services
{
    public interface IRequestService
    {
        IEnumerable<Request> GetAllRequests();
        Request CreateRequest(CreateRequestDto dto);
    }
}
