using System;
using System.Collections.Generic;
using CARMS.Api.Models;
using CARMS.Api.DTOs;

namespace CARMS.Api.Services
{
    public class RequestService : IRequestService
    {
        private readonly List<Request> _requests = new();
        private int _nextId = 1;

        public IEnumerable<Request> GetAllRequests() => _requests;

        public Request CreateRequest(CreateRequestDto dto)
        {
            var newRequest = new Request
            {
                Id = _nextId++,
                ClientName = dto.ClientName,
                Status = "Submitted",
                SubmittedAt = DateTime.UtcNow
            };
            _requests.Add(newRequest);
            return newRequest;
        }
    }
}
