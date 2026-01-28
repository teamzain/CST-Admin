import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

interface AuthLayoutProps {
    children?: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen relative overflow-hidden ">
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] sm:opacity-5 pointer-events-none overflow-hidden">
                <img
                    src="/logo.png"
                    alt="Logo"
                    className="w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] md:w-[800px] md:h-[800px] object-contain select-none"
                />
            </div>

            <div
                className="absolute inset-0 opacity-[0.02] sm:opacity-[0.03]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, white 1px, transparent 1px),
                        linear-gradient(to bottom, white 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px sm:40px 40px',
                }}
            />

            <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6 md:p-8">
                <div className="w-full h-full">{children || <Outlet />}</div>
            </div>

            <style>{`
                @keyframes gradient {
                    0%, 100% {
                        opacity: 0.3;
                    }
                    50% {
                        opacity: 0.6;
                    }
                }

                @keyframes blob {
                    0%, 100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                }

                .animate-gradient {
                    animation: gradient 8s ease-in-out infinite;
                }

                .animate-blob {
                    animation: blob 7s ease-in-out infinite;
                }

                .animation-delay-2000 {
                    animation-delay: 2s;
                }

                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
}
