
import { Home, ArrowLeft, Ghost } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, type To } from 'react-router-dom';

export default function NotFoundPage() {

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        navigate('/');
    };

    const handleNavigate = (path: To) => {
        navigate(path);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
                <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
                {/* Ghost Icon with animation */}
                <div className="flex justify-center">
                    <div className="relative">
                        <Ghost
                            className="w-32 h-32 text-purple-400 animate-bounce"
                            strokeWidth={1.5}
                        />
                        <div className="absolute inset-0 bg-purple-500/30 blur-2xl rounded-full"></div>
                    </div>
                </div>

                {/* 404 Text */}
                <div className="space-y-4">
                    <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-pulse">
                        404
                    </h1>
                    <div className="space-y-2">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">
                            Oops! Page Not Found
                        </h2>
                        <p className="text-lg text-gray-300 max-w-md mx-auto">
                            The page you're looking for seems to have wandered
                            off into the digital void. Let's get you back on
                            track!
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                    <Button
                        onClick={handleGoBack}
                        variant="outline"
                        size="lg"
                        className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white transition-all duration-300 group"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        Go Back
                    </Button>

                    <Button
                        onClick={handleGoHome}
                        size="lg"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/75 group"
                    >
                        <Home className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                        Back to Home
                    </Button>
                </div>

                {/* Helpful Links */}
                <div className="pt-8 border-t border-white/10">
                    <p className="text-sm text-gray-400 mb-4">Quick Links:</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        {[
                            { name: 'Dashboard', path: '/' },
                            { name: 'Courses', path: '/courses' },
                            { name: 'Instructors', path: '/instructors' },
                            { name: 'Students', path: '/students' },
                        ].map((link) => (
                            <button
                                key={link.path}
                                onClick={() => handleNavigate(link.path)}
                                className="text-sm text-purple-300 hover:text-purple-100 underline underline-offset-4 hover:underline-offset-8 transition-all duration-200"
                            >
                                {link.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
