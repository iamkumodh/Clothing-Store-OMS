import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = (e) => {
    e.preventDefault(); 
    fetch('http://localhost:8080/api/auth/login', {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then(async response => {
      const text = await response.text();
      
      if (response.ok) {
        const cleanToken = text.replace(/"/g, '');
        localStorage.setItem('token', cleanToken);
        
        try {
          const payloadBase64Url = cleanToken.split('.')[1];
          let base64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
          
          while (base64.length % 4 !== 0) {
            base64 += '=';
          }
          
          const decodedPayload = JSON.parse(atob(base64));
          const userRole = decodedPayload.role; 
          
          localStorage.setItem("role", userRole); 

          if (userRole === 'ADMIN' || userRole === 'ADMIN_SUPER' || userRole === 'MANAGER' || userRole === 'STORE_STAFF') {
              navigate('/admin/dashboard'); 
          } else {
              navigate('/'); 
          }
        } catch (error) {
          console.error("Failed to decode token role", error);
          navigate('/'); 
        }
      } else {
        setMessage(`❌ Error: ${text}`);
      }
    })
    .catch(error => {
      console.error(error); 
      setMessage("Network error or connection refused.");
    });
  };

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px', maxWidth: '400px' }}>
      <h3>System Login</h3>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="email" 
          placeholder="Email Address" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: '8px' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Sign In
        </button>
        <p><Link to="/forgot-password">Forgot your password?</Link></p>
      </form>
      
      {message && (
        <div style={{ 
            marginTop: '15px', 
            padding: '10px', 
            background: '#e8f5e9', 
            border: '1px solid #c8e6c9', 
            borderRadius: '4px',
            wordBreak: 'break-all',    
            overflowWrap: 'break-word'
        }}>
            <p style={{ margin: 0, fontWeight: 'bold', color: '#2e7d32' }}>{message}</p>
        </div>
      )}
    </div>
  );
}