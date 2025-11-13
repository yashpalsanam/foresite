// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import FormInput from '../components/forms/FormInput';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Basic validation
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        setIsLoading(false);
        return;
      }

      // Call login from AuthContext
      await login(formData.email, formData.password);
      
      // Navigation is handled by AuthContext/AppRoutes
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Sign In
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="admin@foresite.com"
          required
          autoComplete="email"
          disabled={isLoading}
        />

        <FormInput
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
          autoComplete="current-password"
          disabled={isLoading}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-600">Remember me</span>
          </label>
          <a href="#" className="text-blue-600 hover:text-blue-700">
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Need help? <a href="#" className="text-blue-600 hover:text-blue-700">Contact Support</a>
      </div>
    </div>
  );
};

export default Login;