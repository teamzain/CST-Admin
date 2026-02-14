'use client';

import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { authRepository } from '@/repositories/auth';
import { useAuthStore } from '@/stores/auth-store';
import AuthLayout from '@/components/layout/AuthLayout';

export default function LoginPage() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!identifier || !password) {
            setError('Please enter both username/email and password');
            return;
        }

        setIsLoading(true);

        try {
            const response = await authRepository.login({ identifier, password });

            setAuth(
                response.user,
                response.access_token,
                response.refresh_token
            );

            navigate('/');
        } catch (err: any) {
            console.error('Login error:', err);
            setError(
                err.response?.data?.message ||
                    'Invalid credentials. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <Card className="w-full sm:max-w-md bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl mx-auto overflow-hidden">
                <CardHeader className="space-y-3 sm:space-y-4 pb-4 sm:pb-6">
                    <div className="flex flex-col items-center gap-3 sm:gap-4">
                        <div className="relative">
                            <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                                <img
                                    src="/logo.png"
                                    alt="logo"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>

                        <div className="text-center space-y-1 sm:space-y-2">
                            <CardTitle className="text-2xl sm:text-3xl font-bold bg-secondary bg-clip-text text-transparent">
                                CompleteSecurityTraining Admin
                            </CardTitle>
                            <CardDescription className="text-secondary font-medium text-sm sm:text-base">
                                Security Training Platform
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="px-5 sm:px-6 pb-6 mt-4">
                    <form
                        onSubmit={handleLogin}
                        className="space-y-4 sm:space-y-5"
                    >
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span className="leading-tight">{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Username or Email
                            </label>
                            <Input
                                type="text"
                                placeholder="Enter your username or email"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                disabled={isLoading}
                                className="h-10 sm:h-11 bg-slate-50 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all text-sm sm:text-base"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                Password
                            </label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                className="h-10 sm:h-11 bg-slate-50 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all text-sm sm:text-base"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-10 sm:h-11 bg-primary font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>

                        <p className="text-center text-[10px] sm:text-xs text-slate-500 pt-2 px-2">
                            Secure access to your training dashboard
                        </p>
                    </form>
                </CardContent>
            </Card>
        </AuthLayout>
    );
}
