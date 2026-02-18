import axios from 'axios';
import { courseApi } from '@/api';
import { COURSE_ROUTES, buildUrl } from '@/config/routes';
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
        const { data } = await courseApi.get(COURSE_ROUTES.LESSONS.GET_ALL.url);
        return this.extractData<Lesson[]>(data);
    }

    /**
     * Get a single lesson by ID
     */
    static async getById(lessonId: number): Promise<Lesson> {
        const url = buildUrl(COURSE_ROUTES.LESSONS.GET_BY_ID, { lessonId });
        const { data } = await courseApi.get(url);
        return this.extractData<Lesson>(data);
    }

    /**
     * Create a new lesson for a course
     */
    static async create(courseId: number, input: CreateLessonInput | FormData): Promise<Lesson> {
        const url = buildUrl(COURSE_ROUTES.LESSONS.CREATE, { courseId });
        // When sending FormData (video upload), remove default JSON Content-Type
        // so Axios/browser can auto-set multipart/form-data with proper boundary
        const config = input instanceof FormData
            ? { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 120000 }
            : {};
        const { data } = await courseApi.post(url, input, config);
        return this.extractData<Lesson>(data);
    }

    /**
     * Update a lesson
     */
    static async update(lessonId: number, input: UpdateLessonInput): Promise<Lesson> {
        const url = buildUrl(COURSE_ROUTES.LESSONS.UPDATE, { lessonId });
        // When sending FormData (video upload), override Content-Type
        const config = input instanceof FormData
            ? { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 120000 }
            : {};
        const { data } = await courseApi.patch(url, input, config);
        return this.extractData<Lesson>(data);
    }

    /**
     * Delete a lesson
     */
    static async delete(lessonId: number): Promise<void> {
        const url = buildUrl(COURSE_ROUTES.LESSONS.DELETE, { lessonId });
        await courseApi.delete(url);
    }

    /**
     * Replace lesson video
     */
    static async replaceVideo(lessonId: number, videoFile: File): Promise<Lesson> {
        const formData = new FormData();
        formData.append('video', videoFile);
        const url = buildUrl(COURSE_ROUTES.LESSONS.REPLACE_VIDEO, { lessonId });
        const { data } = await courseApi.patch(url, formData, {
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
