const http = require('http');

async function run() {
  // 1. Signup
  let res = await fetch('http://localhost:5000/user/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: 'Test', lastName: 'User', email: 'test@example.com', password: 'password123'
    })
  });
  if (res.status === 400) {
     res = await fetch('http://localhost:5000/user/login', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
     });
  }
  const data = await res.json();
  const token = data.token;
  console.log('Token:', token ? 'Success' : data);

  // 2. Update Professional Details exactly as frontend sends it
  const updateRes = await fetch('http://localhost:5000/user/profile', {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({
      skills: ['React', 'Node'],
      github: '',
      linkedin: '',
      organization: '',
      role: '',
      headline: '',
      experience: [
        { role: 'Dev', company: 'ABC', period: '2023', type: 'Full', desc: 'Desc' }
      ],
      projects: []
    })
  });

  const updateData = await updateRes.json();
  console.log('Update Status:', updateRes.status);
  console.log('Update Data:', updateData);
}

run();
