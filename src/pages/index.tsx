import { useState } from 'react';
import { useRouter } from 'next/router';
import TitleBar from '@/components/Titlebar';

type View = 'signup' | 'signin';

export default function Home() {
  const router = useRouter();
  const [view, setView] = useState<View>('signin');

  const [signUpData, setSignUpData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    admin: false,
  });
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ message: '', isError: false, suggestSignUp: false });

  const switchView = (v: View) => {
    setView(v);
    setStatus({ message: '', isError: false, suggestSignUp: false });
  };

  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSignUpData({ ...signUpData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignInData({ ...signInData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signUpData.password !== signUpData.confirmPassword) {
      setStatus({ message: 'Passwords do not match.', isError: true, suggestSignUp: false });
      return;
    }
    setStatus({ message: 'Loading...', isError: false, suggestSignUp: false });

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: signUpData.fullName,
          email: signUpData.email,
          password: signUpData.password,
          admin: signUpData.admin,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ message: 'Account created! You can now sign in.', isError: false, suggestSignUp: false });
        setSignUpData({ fullName: '', email: '', password: '', confirmPassword: '', admin: false });
      } else {
        setStatus({ message: data.message || 'Failed to create account.', isError: true, suggestSignUp: false });
      }
    } catch {
      setStatus({ message: 'Failed to connect to the server.', isError: true, suggestSignUp: false });
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ message: 'Loading...', isError: false, suggestSignUp: false });

    try {
      const response = await fetch('/api/user/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signInData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ message: 'Signed in! Redirecting...', isError: false, suggestSignUp: false });
        router.push('/dashboard');
      } else {
        const notFound = data.message?.toLowerCase().includes('not found');
        setStatus({
          message: notFound
            ? 'No account found with that email.'
            : data.message?.toLowerCase().includes('password')
            ? 'Incorrect password. Please try again.'
            : data.message || 'Sign in failed.',
          isError: true,
          suggestSignUp: notFound,
        });
      }
    } catch {
      setStatus({ message: 'Failed to connect to the server.', isError: true, suggestSignUp: false });
    }
  };

  const inputClass =
    'w-full bg-transparent border-0 border-b border-red-500 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-700 transition-colors';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TitleBar />
      <div className="flex-1 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {/* sign in */}
        {view === 'signin' && (
          <>
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Login</h1>
            <form onSubmit={handleSignIn} className="space-y-6">
              <input
                type="email"
                name="email"
                value={signInData.email}
                onChange={handleSignInChange}
                required
                placeholder="Email"
                className={inputClass}
              />
              <input
                type="password"
                name="password"
                value={signInData.password}
                onChange={handleSignInChange}
                required
                placeholder="Password"
                className={inputClass}
              />

              {status.message && status.message !== 'Loading...' && (
                <p className={`text-sm text-center ${status.isError ? 'text-red-600' : 'text-green-600'}`}>
                  {status.message}
                </p>
              )}
              {status.message === 'Loading...' && (
                <p className="text-sm text-center text-gray-400">Loading...</p>
              )}

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-full transition-colors mt-2"
              >
                Log in
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-6">
              Don&apos;t have an account?{' '}
              <button onClick={() => switchView('signup')} className="font-bold text-gray-800 hover:underline">
                Sign up
              </button>
            </p>
          </>
        )}

        {/* sign up */}
        {view === 'signup' && (
          <>
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Create Account</h1>
            <form onSubmit={handleSignUp} className="space-y-6">
              <input
                type="text"
                name="fullName"
                value={signUpData.fullName}
                onChange={handleSignUpChange}
                required
                placeholder="Full Name"
                className={inputClass}
              />
              <input
                type="email"
                name="email"
                value={signUpData.email}
                onChange={handleSignUpChange}
                required
                placeholder="Email"
                className={inputClass}
              />
              <input
                type="password"
                name="password"
                value={signUpData.password}
                onChange={handleSignUpChange}
                required
                placeholder="Password"
                className={inputClass}
              />
              <input
                type="password"
                name="confirmPassword"
                value={signUpData.confirmPassword}
                onChange={handleSignUpChange}
                required
                placeholder="Confirm Password"
                className={inputClass}
              />

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="admin"
                  checked={signUpData.admin}
                  onChange={handleSignUpChange}
                  className="w-4 h-4 accent-red-600"
                />
                <span className="text-sm text-gray-700">Admin access</span>
              </label>

              {status.message && status.message !== 'Loading...' && (
                <p className={`text-sm text-center ${status.isError ? 'text-red-600' : 'text-green-600'}`}>
                  {status.message}
                </p>
              )}
              {status.message === 'Loading...' && (
                <p className="text-sm text-center text-gray-400">Loading...</p>
              )}

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-full transition-colors mt-2"
              >
                Sign up
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <button onClick={() => switchView('signin')} className="font-bold text-gray-800 hover:underline">
                Sign in
              </button>
            </p>
          </>
        )}

      </div>
      </div>
    </div>
  );
}
