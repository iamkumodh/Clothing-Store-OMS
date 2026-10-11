import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminPortal() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Updated state to only track valid staff fields
  const [profile, setProfile] = useState({
    firstName: '', lastName: '', designation: '', clearanceLevel: ''
  });
  const [message, setMessage] = useState('');

  const [newStaff, setNewStaff] = useState({
    firstName: '', lastName: '', email: '', password: '',
    designation: 'Cashier', clearanceLevel: 'TIER_1'
  });
  const [staffMessage, setStaffMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // fetches both Profile and Analytics data on load
    const fetchData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
        
        const [profileRes, analyticsRes] = await Promise.all([
          fetch('http://localhost:8080/api/admin/profile', { headers }), // Updated endpoint & added missing comma
          fetch('http://localhost:8080/api/admin/analytics/dashboard', { headers })
        ]);

        if (profileRes.ok) {
            setProfile(await profileRes.json());
        } else {
            console.error("Profile fetch failed with status:", profileRes.status);
        }

        if (analyticsRes.ok) {
            setAnalytics(await analyticsRes.json());
        } else {
            console.error("Analytics fetch failed with status:", analyticsRes.status);
        }
        
      } catch (err) {
        setMessage('Network error loading portal data.');
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    // Create a clean payload containing ONLY the strings the backend expects
    const updatePayload = {
      firstName: profile.firstName,
      lastName: profile.lastName
    };
    
    fetch('http://localhost:8080/api/admin/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(updatePayload) // Send the clean payload instead of the whole profile
    })
    .then(async res => {
      const text = await res.text();
      setMessage(res.ok ? `✅ Profile Updated: ${text}` : `❌ Error: ${text}`);
    }).catch(() => setMessage("❌ Connection failed."));
  };

  const handleStaffRegister = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    fetch('http://localhost:8080/api/auth/register/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newStaff)
    })
    .then(async res => {
      const text = await res.text();
      if (res.ok) {
        setStaffMessage(`✅ Staff registered successfully!`);
        setNewStaff({ firstName: '', lastName: '', email: '', password: '', designation: 'Cashier', clearanceLevel: 'TIER_1' });
      } else {
        setStaffMessage(`❌ Error: ${text}`);
      }
    }).catch(() => setStaffMessage("❌ Connection failed."));
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Admin Portal...</div>;

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Portal Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #2e7d32', paddingBottom: '15px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ color: '#333', margin: 0 }}>D'fine — Admin Portal</h2>
          <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.95rem' }}>Workspace & Staff Management</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '4px 12px', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 'bold' }}>
            SUPER USER
          </span>
          <button 
            onClick={() => { localStorage.clear(); navigate('/login'); }}
            style={{ padding: '8px 16px', cursor: 'pointer', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '1px solid #ddd' }}>
        {['dashboard', 'staff', 'profile'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px', background: activeTab === tab ? '#2e7d32' : 'transparent',
              color: activeTab === tab ? 'white' : '#555', border: 'none', borderRadius: '4px 4px 0 0',
              cursor: 'pointer', fontWeight: 'bold'
            }}
          >
            {tab === 'dashboard' ? 'Analytics Dashboard' : tab === 'staff' ? 'Manage Staff' : 'My Profile'}
          </button>
        ))}
      </div>

      {/* CONTENT: ANALYTICS */}
      {activeTab === 'dashboard' && (
        analytics ? (
          <div>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
              <MetricCard color="#1976d2" title="Registered Customers" value={analytics.totalCustomers} />
              <MetricCard color="#f57c00" title="Orders Processed" value={analytics.totalOrders} />
              <MetricCard color="#388e3c" title="Total Revenue" value={`$${analytics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
            </div>
            <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
              <h3 style={{ marginTop: 0, color: '#444' }}>Order Status Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                {Object.entries(analytics.ordersByStatus).map(([status, count]) => (
                  <StatusBar count={count} key={status} status={status} total={analytics.totalOrders} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: '#ffebee', padding: '25px', borderRadius: '8px', border: '1px solid #ef5350', textAlign: 'center' }}>
            <h3 style={{ color: '#c62828', marginTop: 0 }}>Analytics Data Unavailable</h3>
            <p style={{ color: '#b71c1c', marginBottom: 0 }}>
              The backend endpoint <strong>/api/admin/analytics/dashboard</strong> returned an error or was not found. Please verify your AdminAnalyticsController mapping.
            </p>
          </div>
        )
      )}

      {/* CONTENT: MANAGE STAFF */}
      {activeTab === 'staff' && (
        <div style={{ background: '#f5f5f5', padding: '25px', borderRadius: '8px', maxWidth: '600px' }}>
          <h3 style={{ marginTop: 0 }}>Register New Staff Member</h3>
          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '20px' }}>Allocate tasks and clearance levels to new employees.</p>
          
          {staffMessage && <div style={{ marginBottom: '15px', padding: '10px', background: staffMessage.includes('✅') ? '#e8f5e9' : '#ffebee', borderRadius: '4px' }}><strong>{staffMessage}</strong></div>}

          <form onSubmit={handleStaffRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="text" placeholder="First Name" required style={{ padding: '8px', flex: 1 }} value={newStaff.firstName} onChange={e => setNewStaff({...newStaff, firstName: e.target.value})} />
              <input type="text" placeholder="Last Name" required style={{ padding: '8px', flex: 1 }} value={newStaff.lastName} onChange={e => setNewStaff({...newStaff, lastName: e.target.value})} />
            </div>
            <input type="email" placeholder="Account Email" required style={{ padding: '8px' }} value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} />
            <input type="password" placeholder="Temporary Password" required style={{ padding: '8px' }} value={newStaff.password} onChange={e => setNewStaff({...newStaff, password: e.target.value})} />
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#555' }}>Designation / Task</label>
                <input type="text" placeholder="e.g., Inventory Clerk" required style={{ padding: '8px', width: '100%', marginTop: '5px', boxSizing: 'border-box' }} value={newStaff.designation} onChange={e => setNewStaff({...newStaff, designation: e.target.value})} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#555' }}>Clearance Level</label>
                <select 
                  style={{ padding: '8px', width: '100%', marginTop: '5px', boxSizing: 'border-box' }} 
                  value={newStaff.clearanceLevel} 
                  onChange={e => setNewStaff({...newStaff, clearanceLevel: e.target.value})}
                >
                  <option value="TIER_1">Standard Staff</option>
                  <option value="TIER_2">Manager</option>
                  <option value="ADMIN_SUPER">Super Admin</option>
                </select>
              </div>
            </div>

            <button type="submit" style={{ padding: '12px', background: '#f57c00', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
              Create Staff Account
            </button>
          </form>
        </div>
      )}

      {/* CONTENT: MY PROFILE */}
      {activeTab === 'profile' && (
        <div style={{ background: '#f5f5f5', padding: '25px', borderRadius: '8px', maxWidth: '600px' }}>
          <h3 style={{ marginTop: 0 }}>My Profile</h3>
          {message && <div style={{ marginBottom: '15px', padding: '10px', background: '#e3f2fd', borderRadius: '4px' }}><strong>{message}</strong></div>}
          
          <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#555' }}>First Name</label>
                <input type="text" name="firstName" value={profile.firstName || ''} onChange={e => setProfile({...profile, firstName: e.target.value})} required style={{ padding: '8px', width: '100%', marginTop: '5px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#555' }}>Last Name</label>
                <input type="text" name="lastName" value={profile.lastName || ''} onChange={e => setProfile({...profile, lastName: e.target.value})} required style={{ padding: '8px', width: '100%', marginTop: '5px', boxSizing: 'border-box' }} />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#555' }}>Designation (Read Only)</label>
                <input type="text" value={profile.designation || ''} disabled style={{ padding: '8px', width: '100%', marginTop: '5px', boxSizing: 'border-box', background: '#e0e0e0' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#555' }}>Clearance Level (Read Only)</label>
                <input type="text" value={profile.clearanceLevel || ''} disabled style={{ padding: '8px', width: '100%', marginTop: '5px', boxSizing: 'border-box', background: '#e0e0e0' }} />
              </div>
            </div>

            <button type="submit" style={{ padding: '12px', background: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px', fontWeight: 'bold' }}>
              Update Profile
            </button>
          </form>
        </div>
      )}

    </div>
  );
}

// sub-components for Analytics Tab
function MetricCard({ title, value, color }) {
  return (
    <div style={{ flex: '1 1 250px', padding: '20px', background: '#fff', borderRadius: '8px', borderTop: `4px solid ${color}`, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <p style={{ margin: 0, color: '#666', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</p>
      <h3 style={{ margin: '10px 0 0 0', color: '#222', fontSize: '2rem' }}>{value}</h3>
    </div>
  );
}

function StatusBar({ status, count, total }) {
  const percentage = total === 0 ? 0 : Math.round((count / total) * 100);
  let barColor = '#607d8b'; 
  if (status === 'DELIVERED') barColor = '#4caf50';
  if (status === 'PENDING') barColor = '#ff9800';
  if (status === 'CANCELED') barColor = '#f44336';
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 'bold', color: '#555' }}>
        <span>{status}</span><span>{count} orders ({percentage}%)</span>
      </div>
      <div style={{ width: '100%', background: '#e0e0e0', borderRadius: '6px', height: '14px', overflow: 'hidden' }}>
        <div style={{ width: `${percentage}%`, background: barColor, height: '100%', transition: 'width 1s ease-in-out' }}></div>
      </div>
    </div>
  );
}