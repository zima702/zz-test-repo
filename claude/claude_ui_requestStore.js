import { makeAutoObservable, runInAction } from ‘mobx’;
import axios from ‘axios’;

class RequestStore {
requests = [];
currentRequest = null;
auditTrail = [];
loading = false;
actionLoading = false;
filter = ‘all’;
message = { type: ‘’, text: ‘’ };
errors = {};

constructor() {
makeAutoObservable(this);
this.setupAxiosInterceptors();
}

setupAxiosInterceptors() {
// Request interceptor for auth token
axios.interceptors.request.use(
(config) => {
const token = localStorage.getItem(‘authToken’);
if (token) {
config.headers.Authorization = `Bearer ${token}`;
}
return config;
},
(error) => Promise.reject(error)
);

```
// Response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      this.setMessage('error', 'Your session has expired. Please log in again.');
    } else if (error.response?.status >= 500) {
      this.setMessage('error', 'An unexpected error occurred. Our technical team has been notified. Please try again in a few minutes.');
    }
    return Promise.reject(error);
  }
);
```

}

setLoading(loading) {
this.loading = loading;
}

setActionLoading(loading) {
this.actionLoading = loading;
}

setFilter(filter) {
this.filter = filter;
}

setMessage(type, text) {
this.message = { type, text };
}

clearMessage() {
this.message = { type: ‘’, text: ‘’ };
}

setErrors(errors) {
this.errors = errors;
}

clearErrors() {
this.errors = {};
}

clearError(field) {
if (this.errors[field]) {
delete this.errors[field];
}
}

get filteredRequests() {
if (this.filter === ‘all’) return this.requests;
return this.requests.filter(request =>
request.status.toLowerCase() === this.filter.toLowerCase()
);
}

async fetchRequests() {
try {
this.setLoading(true);
this.clearMessage();

```
  const response = await axios.get('/api/requests', {
    params: { filter: this.filter }
  });
  
  runInAction(() => {
    this.requests = response.data;
  });
} catch (error) {
  console.error('Error fetching requests:', error);
  this.setMessage('error', 'Failed to load requests. Please try again.');
} finally {
  this.setLoading(false);
}
```

}

async fetchRequestById(id) {
try {
this.setLoading(true);
this.clearMessage();

```
  const [requestResponse, auditResponse] = await Promise.all([
    axios.get(`/api/requests/${id}`),
    axios.get(`/api/requests/${id}/audit`)
  ]);
  
  runInAction(() => {
    this.currentRequest = requestResponse.data;
    this.auditTrail = auditResponse.data;
  });
} catch (error) {
  console.error('Error fetching request details:', error);
  this.setMessage('error', 'Failed to load request details. Please try again.');
} finally {
  this.setLoading(false);
}
```

}

async createRequest(requestData, isDraft = false) {
try {
this.setActionLoading(true);
this.clearMessage();
this.clearErrors();

```
  const payload = {
    ...requestData,
    status: isDraft ? 'Draft' : 'Submitted'
  };
  
  const response = await axios.post('/api/requests', payload);
  
  const successMessage = isDraft 
    ? 'Request has been saved as draft successfully.'
    : `Request #${response.data.id} for ${requestData.clientName} has been submitted successfully.`;
  
  this.setMessage('success', successMessage);
  
  runInAction(() => {
    this.requests.unshift(response.data);
  });
  
  return response.data;
} catch (error) {
  if (error.response?.status === 400) {
    const validationErrors = error.response.data.errors || {};
    this.setErrors(validationErrors);
    this.setMessage('error', 'Please correct the errors below and try again.');
  } else {
    this.setMessage('error', 'An unexpected error occurred while processing your request. Please try again.');
  }
  throw error;
} finally {
  this.setActionLoading(false);
}
```

}

async updateRequest(id, requestData, isDraft = false) {
try {
this.setActionLoading(true);
this.clearMessage();
this.clearErrors();

```
  const payload = {
    ...requestData,
    status: isDraft ? 'Draft' : 'Submitted'
  };
  
  const response = await axios.put(`/api/requests/${id}`, payload);
  
  const successMessage = isDraft 
    ? 'Request has been updated and saved as draft successfully.'
    : `Request #${id} for ${requestData.clientName} has been updated and submitted successfully.`;
  
  this.setMessage('success', successMessage);
  
  runInAction(() => {
    const index = this.requests.findIndex(req => req.id === id);
    if (index !== -1) {
      this.requests[index] = response.data;
    }
    this.currentRequest = response.data;
  });
  
  return response.data;
} catch (error) {
  if (error.response?.status === 400) {
    const validationErrors = error.response.data.errors || {};
    this.setErrors(validationErrors);
    this.setMessage('error', 'Please correct the errors below and try again.');
  } else {
    this.setMessage('error', 'An unexpected error occurred while updating your request. Please try again.');
  }
  throw error;
} finally {
  this.setActionLoading(false);
}
```

}

async approveRequest(id) {
try {
this.setActionLoading(true);
this.clearMessage();

```
  const response = await axios.post(`/api/requests/${id}/approve`);
  
  this.setMessage('success', 
    `Request #${id} for ${this.currentRequest?.clientName} has been approved successfully. Access provisioning is now in progress.`
  );
  
  runInAction(() => {
    if (this.currentRequest) {
      this.currentRequest.status = 'Approved';
    }
    const index = this.requests.findIndex(req => req.id === id);
    if (index !== -1) {
      this.requests[index].status = 'Approved';
    }
  });
  
  // Refresh audit trail
  setTimeout(() => this.fetchAuditTrail(id), 1000);
  
} catch (error) {
  console.error('Error approving request:', error);
  this.setMessage('error', 'Failed to approve request. Please try again.');
} finally {
  this.setActionLoading(false);
}
```

}

async rejectRequest(id, reason) {
try {
this.setActionLoading(true);
this.clearMessage();

```
  if (!reason?.trim()) {
    this.setMessage('error', 'Please provide a reason for rejection before submitting.');
    return;
  }
  
  const response = await axios.post(`/api/requests/${id}/reject`, {
    reason: reason.trim()
  });
  
  this.setMessage('success', 
    `Request #${id} for ${this.currentRequest?.clientName} has been rejected. The requester has been notified.`
  );
  
  runInAction(() => {
    if (this.currentRequest) {
      this.currentRequest.status = 'Rejected';
      this.currentRequest.rejectionReason = reason.trim();
    }
    const index = this.requests.findIndex(req => req.id === id);
    if (index !== -1) {
      this.requests[index].status = 'Rejected';
    }
  });
  
  // Refresh audit trail
  setTimeout(() => this.fetchAuditTrail(id), 1000);
  
} catch (error) {
  console.error('Error rejecting request:', error);
  this.setMessage('error', 'Failed to reject request. Please try again.');
} finally {
  this.setActionLoading(false);
}
```

}

async fetchAuditTrail(id) {
try {
const response = await axios.get(`/api/requests/${id}/audit`);
runInAction(() => {
this.auditTrail = response.data;
});
} catch (error) {
console.error(‘Error fetching audit trail:’, error);
}
}

validateForm(formData) {
const errors = {};

```
if (!formData.clientName?.trim()) {
  errors.clientName = 'Client name is required';
}

if (!formData.clientEmail?.trim()) {
  errors.clientEmail = 'Client email is required';
} else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) {
  errors.clientEmail = 'Please enter a valid email address';
}

if (!formData.accountNumber?.trim()) {
  errors.accountNumber = 'Account number is required';
}

if (!formData.requestType) {
  errors.requestType = 'Please select a request type';
}

if (!formData.accessLevel) {
  errors.accessLevel = 'Please select an access level';
}

if (!formData.justification?.trim()) {
  errors.justification = 'Business justification is required';
}

this.setErrors(errors);
return Object.keys(errors).length === 0;
```

}
}

export default new RequestStore();