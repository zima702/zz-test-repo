import React, { useState, useEffect } from ‘react’;
import { useParams, useNavigate } from ‘react-router-dom’;
import { observer } from ‘mobx-react-lite’;
import requestStore from ‘../stores/RequestStore’;

const RequestForm = () => {
const { id } = useParams();
const navigate = useNavigate();
const isEditing = Boolean(id);

const [formData, setFormData] = useState({
clientName: ‘’,
clientEmail: ‘’,
accountNumber: ‘’,
requestType: ‘’,
accessLevel: ‘’,
justification: ‘’,
urgency: ‘normal’,
notes: ‘’
});

useEffect(() => {
if (isEditing) {
requestStore.fetchRequestById(id);
}

```
return () => {
  requestStore.clearMessage();
  requestStore.clearErrors();
};
```

}, [id, isEditing]);

useEffect(() => {
if (isEditing && requestStore.currentRequest) {
setFormData({
clientName: requestStore.currentRequest.clientName || ‘’,
clientEmail: requestStore.currentRequest.clientEmail || ‘’,
accountNumber: requestStore.currentRequest.accountNumber || ‘’,
requestType: requestStore.currentRequest.requestType || ‘’,
accessLevel: requestStore.currentRequest.accessLevel || ‘’,
justification: requestStore.currentRequest.justification || ‘’,
urgency: requestStore.currentRequest.urgency || ‘normal’,
notes: requestStore.currentRequest.notes || ‘’
});
}
}, [requestStore.currentRequest, isEditing]);

const handleInputChange = (e) => {
const { name, value } = e.target;
setFormData(prev => ({
…prev,
[name]: value
}));

```
// Clear error for this field if it exists
if (requestStore.errors[name]) {
  requestStore.clearError(name);
}
```

};

const handleSubmit = async (e, isDraft = false) => {
e.preventDefault();

```
if (!isDraft && !requestStore.validateForm(formData)) {
  requestStore.setMessage('error', 'Please correct the errors below and try again.');
  return;
}

try {
  if (isEditing) {
    await requestStore.updateRequest(id, formData, isDraft);
  } else {
    await requestStore.createRequest(formData, isDraft);
  }
  
  // Redirect after success
  setTimeout(() => {
    navigate('/dashboard');
  }, 2000);
  
} catch (error) {
  // Error handling is done in the store
}
```

};

const handleCancel = () => {
navigate(’/dashboard’);
};

if (requestStore.loading && isEditing) {
return (
<div className="min-h-screen bg-gray-50 flex items-center justify-center">
<div className="text-center">
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
<p className="mt-4 text-gray-600">Loading request…</p>
</div>
</div>
);
}

return (
<div className="min-h-screen bg-gray-50 py-8">
<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
{/* Header */}
<div className="bg-white shadow-sm rounded-lg p-6 mb-6">
<div className="border-b border-gray-200 pb-4">
<h1 className="text-3xl font-bold text-gray-900">
{isEditing ? ‘Edit Request’ : ‘Create New Access Request’}
</h1>
{isEditing && (
<p className="mt-2 text-gray-600">Request ID: {id}</p>
)}
</div>
</div>

```
    {/* Message Display */}
    {requestStore.message.text && (
      <div className={`mb-6 p-4 rounded-md ${
        requestStore.message.type === 'success' 
          ? 'bg-green-50 border border-green-200 text-green-800' 
          : 'bg-red-50 border border-red-200 text-red-800'
      }`}>
        <div className="flex">
          <div className="flex-shrink-0">
            {requestStore.message.type === 'success' ? (
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{requestStore.message.text}</p>
          </div>
        </div>
      </div>
    )}

    {/* Form */}
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
      {/* Client Information Section */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px
```