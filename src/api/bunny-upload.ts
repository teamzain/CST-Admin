import axios, { AxiosError } from 'axios';
import { getBaseApiUrl } from '@/config';
import { APP_NAMES } from '@/utils/constants';

export interface UploadResponse {
    url: string;
    path: string;
    filename: string;
}

class BunnyUploadService {
    private axiosInstance = axios.create();

    constructor() {
        this.setupInterceptors();
    }

    private setupInterceptors() {
        this.axiosInstance.interceptors.request.use((config) => {
            // Set base URL dynamically for each request
            config.baseURL = getBaseApiUrl(APP_NAMES.COURSE);

            const token = localStorage.getItem('auth-token') || localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        // Add response error logging
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                console.error('Bunny API Error:', {
                    url: error.config?.url,
                    baseURL: error.config?.baseURL,
                    status: error.response?.status,
                    message: error.message,
                });
                return Promise.reject(error);
            }
        );
    }

    private validateImageFile(file: File): boolean {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
        const maxSize = 50 * 1024 * 1024; // 50MB

        if (!allowedTypes.includes(file.type)) {
            throw new Error('Invalid file type. Allowed: JPEG, PNG, GIF, WebP, PDF');
        }

        if (file.size > maxSize) {
            throw new Error('File size exceeds 5MB limit');
        }

        return true;
    }

    /**
     * Upload file to Bunny Stream
     * @param file - File to upload
     * @param path - Storage path (e.g., 'course/', 'course-lesson/')
     * @returns Upload response with URL and path
     */
    async uploadFile(file: File, path: string = 'course/'): Promise<UploadResponse> {
        try {
            this.validateImageFile(file);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('path', path);

            const response = await this.axiosInstance.post<UploadResponse>('bunny-upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error uploading file to Bunny:', {
                message: axiosError.message,
                status: axiosError.response?.status,
                statusText: axiosError.response?.statusText,
                url: `${getBaseApiUrl(APP_NAMES.COURSE)}/bunny-upload`,
                file: file.name,
                size: file.size,
            });
            throw error;
        }
    }

    /**
     * Upload multiple files to Bunny Stream
     * @param files - Files to upload
     * @param path - Storage path
     * @returns Array of upload responses
     */
    async uploadFiles(files: File[], path: string = 'course/'): Promise<UploadResponse[]> {
        try {
            const uploadPromises = files.map((file) => this.uploadFile(file, path));
            return await Promise.all(uploadPromises);
        } catch (error) {
            console.error('Error uploading files:', error);
            throw error;
        }
    }

    /**
     * Delete file from Bunny Stream
     * @param path - Full path to file (e.g., 'course/filename.jpg')
     */
    async deleteFile(path: string): Promise<void> {
        try {
            await this.axiosInstance.delete('bunny/delete-file', {
                data: { path },
            });
        } catch (error) {
            console.error('Error deleting file from Bunny:', {
                message: error instanceof Error ? error.message : 'Unknown error',
                path,
            });
            throw error;
        }
    }
}

export const bunnyUploadService = new BunnyUploadService();
