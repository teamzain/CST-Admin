// Diagnostic helper - add to bunny-upload.ts for debugging
export const getBunnyDiagnostics = () => {
    const baseUrl = import.meta.env.VITE_BUNNY_API_BASE_URL || 'http://localhost:3012/api';
    const token = localStorage.getItem('token') || import.meta.env.VITE_ADMIN_TOKEN;
    
    return {
        baseUrl,
        uploadEndpoint: `${baseUrl}/course/bunny-upload`,
        deleteEndpoint: `${baseUrl}/course/bunny/delete-file`,
        hasToken: !!token,
        tokenLength: token?.length || 0,
        environment: import.meta.env.MODE,
    };
};

// Usage in console:
// import { getBunnyDiagnostics } from '@/api/bunny-upload'
// console.log(getBunnyDiagnostics())
