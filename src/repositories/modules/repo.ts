import { courseApi } from '@/api';
import type { Module, CreateModuleInput, UpdateModuleInput } from './types';

interface ApiResponse<T> {
    data?: T;
    modules?: Module[];
    module?: Module;
}

export class ModulesRepository {
    private static extractData<T>(response: ApiResponse<T> | T[] | T): T {
        if (!response) return [] as unknown as T;
        if (Array.isArray(response)) return response as unknown as T;

        const data = response as ApiResponse<T>;
        if (data.data !== undefined) {
            const nested = data.data as ApiResponse<T> | T[] | T;
            if (Array.isArray(nested)) return nested as unknown as T;
            const nestedObj = nested as ApiResponse<T>;
            if (nestedObj.modules !== undefined) return nestedObj.modules as unknown as T;
            if (nestedObj.module !== undefined) return nestedObj.module as unknown as T;
            return nested as T;
        }
        if (data.modules !== undefined) return data.modules as unknown as T;
        if (data.module !== undefined) return data.module as unknown as T;

        return response as T;
    }

    /**
     * Normalize module data to ensure sub-arrays exist
     */
    private static normalizeModule(item: Module | { module: Module }): Module {
        const module = 'module' in item ? item.module : item;
        return {
            ...module,
            lessons: module.lessons || [],
            sessions: module.sessions || [],
            quizzes: module.quizzes || [],
        };
    }

    /**
     * Get all modules for a course
     */
    static async getByCourse(courseId: number): Promise<Module[]> {
        const { data } = await courseApi.get(`/${courseId}/modules`);
        const result = this.extractData<Module[]>(data);
        const modulesArray = Array.isArray(result) ? result : [];
        return modulesArray.map(this.normalizeModule);
    }

    /**
     * Get a single module by ID
     */
    static async getById(moduleId: number): Promise<Module> {
        const { data } = await courseApi.get(`/module/${moduleId}`);
        return this.normalizeModule(this.extractData<Module>(data));
    }

    /**
     * Create a new module for a course
     */
    static async create(courseId: number, input: CreateModuleInput): Promise<Module> {
        const { data } = await courseApi.post(`/${courseId}/modules`, input);
        return this.normalizeModule(this.extractData<Module>(data));
    }

    /**
     * Update a module
     */
    static async update(moduleId: number, input: UpdateModuleInput): Promise<Module> {
        const { data } = await courseApi.patch(`/module/${moduleId}`, input);
        return this.normalizeModule(this.extractData<Module>(data));
    }

    /**
     * Update module order (for drag and drop)
     */
    static async updateOrder(moduleId: number, newOrderIndex: number): Promise<Module> {
        return this.update(moduleId, { order_index: newOrderIndex });
    }

    /**
     * Delete a module
     */
    static async delete(moduleId: number): Promise<void> {
        await courseApi.delete(`/module/${moduleId}`);
    }
}

export const modulesRepository = new ModulesRepository();
