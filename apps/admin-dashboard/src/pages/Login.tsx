import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@red-giant/ui';
import { login } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { loginSchema, type LoginValues } from '../lib/validation';

export function Login() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginValues) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const { access_token } = await login(values);
      setSession(access_token, values.email);
      navigate('/', { replace: true });
    } catch (err) {
      setServerError('Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-800">
        <h1 className="text-2xl font-bold text-white mb-1">Red Giant Admin</h1>
        <p className="text-slate-400 mb-6">Sign in to manage the activation platform</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              placeholder="admin@redgiant.co.ke"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Password</label>
            <input
              {...register('password')}
              type="password"
              className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {serverError && <p className="text-red-400 text-sm">{serverError}</p>}

          <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
