import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from './LoginForm'
import ProtectedRoute from './ProtectedRoute'
import AdminDashboard from "./AdminDashboard";
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')
  const [city, setCity] = useState('')
  const [district, setDistrict] = useState('')
  const [province, setProvince] = useState('')
  const [postalCode, setPostalCode] = useState('')

  const handleRegister = (e) => {
    e.preventDefault()
    const requestPayload = { email, password, firstName, lastName, contactNumber, shippingAddress, city, district, province, postalCode }
    
    fetch('http://localhost:8080/api/auth/register/customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestPayload)
    })
      .then(response => response.json())
      .then(() => {
        setEmail(''); setPassword(''); setFirstName(''); setLastName(''); setContactNumber('');
        setShippingAddress(''); setCity(''); setDistrict(''); setProvince(''); setPostalCode('');
        alert("Registration Successful! Please log in.");
        window.location.href = "/login"; 
      })
      .catch(error => console.error("Error registering customer:", error))
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '20px', marginBottom: '20px' }}>
              <h2>D'fine</h2>
              <button 
                onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
                style={{ padding: '8px 16px', cursor: 'pointer', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
              >
                Logout
              </button>
            </div>
            <h1>Welcome to D'fine</h1>
            <p>The customer storefront will go here.</p>
          </div>
        } />

        <Route path="/login" element={
          <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>D'fine</h2>
              <a href="/register" style={{ padding: '8px 16px', background: '#333', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                Go to Register
              </a>
            </div>
            
            {/* Removed the onLoginSuccess prop completely */}
            <LoginForm />
          </div>
        } />

        <Route path="/register" element={
          <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>D'fine</h2>
              <a href="/login" style={{ padding: '8px 16px', background: '#333', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                Go to Login
              </a>
            </div>
            
            <div style={{ background: '#e3f2fd', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3>Customer Registration</h3>
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required style={{ padding: '8px', flex: 1 }} />
                  <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required style={{ padding: '8px', flex: 1 }} />
                </div>
                <input type="tel" placeholder="Contact Number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} required style={{ padding: '8px' }} />
                <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '8px' }} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '8px' }} />
                
                <h3 style={{ marginTop: '10px', marginBottom: '5px' }}>Shipping Address</h3>
                <input type="text" placeholder="Street Address" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} required style={{ padding: '8px' }} />
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required style={{ padding: '8px', flex: 1 }} />
                  <input type="text" placeholder="District" value={district} onChange={(e) => setDistrict(e.target.value)} required style={{ padding: '8px', flex: 1 }} />
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" placeholder="Province" value={province} onChange={(e) => setProvince(e.target.value)} required style={{ padding: '8px', flex: 1 }} />
                  <input type="text" placeholder="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} style={{ padding: '8px', flex: 1 }} />
                </div>
                
                <button type="submit" style={{ padding: '12px', background: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '15px', fontWeight: 'bold' }}>
                  Complete Registration
                </button>
              </form>
            </div>
          </div>
        } />

        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  )
}

export default App