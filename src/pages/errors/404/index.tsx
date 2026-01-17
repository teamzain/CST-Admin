import { Home, ArrowLeft, Ghost } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, type To } from 'react-router-dom';

export default function NotFoundPage() {
    const navigate = useNavigate();

    const handleNavigate = (to: To) => navigate(to);

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-background text-foreground overflow-hidden px-4">
            {/* Background effects */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl dark:bg-purple-500/30" />
                <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl dark:bg-blue-500/30" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-xl w-full text-center space-y-8">
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="relative">
                        <Ghost className="h-28 w-28 text-primary animate-bounce" />
                        <div className="absolute inset-0 rounded-full blur-2xl bg-primary/20 dark:bg-primary/30" />
                    </div>
                </div>

                {/* Text */}
                <div className="space-y-3">
                    <h1 className="text-8xl font-extrabold bg-gradient-to-r from-primary via-pink-500 to-purple-500 bg-clip-text text-transparent">
                        404
                    </h1>

                    <h2 className="text-3xl font-bold">Page not found</h2>

                    <p className="mx-auto max-w-md text-muted-foreground">
                        The page you’re looking for doesn’t exist or was moved.
                        Let’s get you back to something useful.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => navigate(-1)}
                        className="group"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Go back
                    </Button>

                    <Button
                        size="lg"
                        onClick={() => handleNavigate('/')}
                        className="group shadow-lg dark:shadow-primary/40"
                    >
                        <Home className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                        Home
                    </Button>
                </div>

                {/* Links */}
                <div className="pt-6 border-t border-border">
                    <p className="mb-3 text-sm text-muted-foreground">
                        Quick links
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        {[
                            { name: 'Dashboard', path: '/' },
                            { name: 'Courses', path: '/courses' },
                            { name: 'Instructors', path: '/instructors' },
                            { name: 'Students', path: '/students' },
                        ].map((link) => (
                            <button
                                key={link.path}
                                onClick={() => handleNavigate(link.path)}
                                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
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
