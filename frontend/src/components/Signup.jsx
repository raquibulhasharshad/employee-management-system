import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Auth.css';

const Signup = () => {
  const navigate = useNavigate();

  const [adminName, setAdminName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');

    if (adminName.trim().length < 2) return setError("Admin name is required.");
    if (companyName.trim().length < 2) return setError("Company name is required.");
    if (!validateEmail(email)) return setError("Enter a valid email.");
    if (!validatePhone(phone)) return setError("Phone number must be exactly 10 digits.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");

    fetch("http://localhost:5000/api/auth/signup", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminName, companyName, email, phone, address, password })
    })
      .then(res => {
        if (!res.ok) throw new Error('Signup failed');
        return res.json();
      })
      .then(() => {
        alert("Account created successfully!");
        navigate("/");
      })
      .catch(err => setError(err.message || "Signup error"));
  };

  return (
    <div className="auth-container">
      <h2>Admin Signup</h2>
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="Admin Name" value={adminName} onChange={e => setAdminName(e.target.value)} required />
        <input type="text" placeholder="Company Name" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
        <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} required />
        <textarea placeholder="Company Address (Optional)" value={address} onChange={e => setAddress(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
        {error && <div className="error-msg">{error}</div>}
        <button type="submit">Create Account</button>
      </form>
      <p>Already have an account? <a href="/admin/login">Login</a></p>
    </div>
  );
};

export default Signup;
