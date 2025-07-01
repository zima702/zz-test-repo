using System.Linq;
using Xunit;
using CARMS.Api.Services;
using CARMS.Api.DTOs;

namespace CARMS.Api.Tests
{
    public class RequestServiceTests
    {
        [Fact]
        public void CanCreateRequest()
        {
            var service = new RequestService();
            var dto = new CreateRequestDto { ClientName = "Test Client" };
            var request = service.CreateRequest(dto);

            Assert.NotNull(request);
            Assert.Equal("Test Client", request.ClientName);
            Assert.Equal("Submitted", request.Status);
        }

        [Fact]
        public void CanGetAllRequests()
        {
            var service = new RequestService();
            service.CreateRequest(new CreateRequestDto { ClientName = "Client A" });
            service.CreateRequest(new CreateRequestDto { ClientName = "Client B" });

            var requests = service.GetAllRequests();
            Assert.Equal(2, requests.Count());
        }
    }
}
