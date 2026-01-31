import axios from 'axios';
import { courseApi } from '@/api';
import type { Lesson, CreateLessonInput, UpdateLessonInput } from './types';

interface ApiResponse<T> {
    data?: T;
    lessons?: Lesson[];
    lesson?: Lesson;
}

export class LessonsRepository {
    private static extractData<T>(response: ApiResponse<T> | T[] | T): T {
        if (!response) return [] as unknown as T;
        if (Array.isArray(response)) return response as unknown as T;

        const data = response as ApiResponse<T>;
        if (data.data !== undefined) {
            const nested = data.data as ApiResponse<T> | T[] | T;
            if (Array.isArray(nested)) return nested as unknown as T;
            const nestedObj = nested as ApiResponse<T>;
            if (nestedObj.lessons !== undefined) return nestedObj.lessons as unknown as T;
            if (nestedObj.lesson !== undefined) return nestedObj.lesson as unknown as T;
            return nested as T;
        }
        if (data.lessons !== undefined) return data.lessons as unknown as T;
        if (data.lesson !== undefined) return data.lesson as unknown as T;

        return response as T;
    }

    /**
     * Get all lessons across all courses
     */
    static async getAll(): Promise<Lesson[]> {
        const { data } = await courseApi.get('/lessons/all');
        return this.extractData<Lesson[]>(data);
    }

    /**
     * Get a single lesson by ID
     */
    static async getById(lessonId: number): Promise<Lesson> {
        const { data } = await courseApi.get(`/lesson/${lessonId}`);
        return this.extractData<Lesson>(data);
    }

    /**
     * Create a new lesson for a course
     */
    static async create(courseId: number, input: CreateLessonInput | FormData): Promise<Lesson> {
        const { data } = await courseApi.post(`/${courseId}/lessons`, input);
        return this.extractData<Lesson>(data);
    }

    /**
     * Update a lesson
     */
    static async update(lessonId: number, input: UpdateLessonInput): Promise<Lesson> {
        const { data } = await courseApi.patch(`/lesson/${lessonId}`, input);
        return this.extractData<Lesson>(data);
    }

    /**
     * Delete a lesson
     */
    static async delete(lessonId: number): Promise<void> {
        await courseApi.delete(`/lesson/${lessonId}`);
    }

    /**
     * Replace lesson video
     */
    static async replaceVideo(lessonId: number, videoFile: File): Promise<Lesson> {
        const formData = new FormData();
        formData.append('video', videoFile);
        const { data } = await courseApi.patch(`/lesson/${lessonId}/video`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return this.extractData<Lesson>(data);
    }

    /**
     * Delete video from Bunny Stream
     */
    static async deleteBunnyVideo(libraryId: number, videoId: string): Promise<void> {
        const apiKey = import.meta.env.VITE_BUNNY_API_KEY;
        if (!apiKey) throw new Error('Bunny API Key not found in environment');

        let streamUrl = import.meta.env.VITE_BUNNY_STREAM_URL || 'https://video.bunnycdn.com/library/';
        if (!streamUrl.endsWith('/')) {
            streamUrl += '/';
        }

        const url = `${streamUrl}${libraryId}/videos/${videoId}`;
        await axios.delete(url, {
            headers: {
                'AccessKey': apiKey,
                'accept': 'application/json',
            },
        });
    }
}

export const lessonsRepository = new LessonsRepository();
