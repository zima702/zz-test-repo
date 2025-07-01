import React from 'react';
import RequestForm from './components/RequestForm';
import RequestList from './components/RequestList';

function App() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>CARMS Request Dashboard</h1>
      <RequestForm />
      <hr />
      <RequestList />
    </div>
  );
}

export default App;
