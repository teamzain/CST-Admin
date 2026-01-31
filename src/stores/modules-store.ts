import { create } from 'zustand';
import { ModulesRepository, type Module, type CreateModuleInput } from '@/repositories/modules';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

// Helper function to extract error messages from backend response
const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
        const data = error.response?.data as { message?: string | string[] };
        if (data?.message) {
            if (Array.isArray(data.message)) {
                return data.message.join(', ');
            }
            return data.message;
        }
    }
    return 'Something went wrong';
};

interface ModulesStore {
    modules: Module[];
    isLoading: boolean;
    error: string | null;
    currentCourseId: number | null;
    fetchModules: (courseId: number) => Promise<void>;
    addModule: (courseId: number, moduleData: CreateModuleInput) => Promise<void>;
    updateModule: (moduleId: number, moduleData: Partial<CreateModuleInput>) => Promise<void>;
    deleteModule: (moduleId: number) => Promise<void>;
    reorderModules: (moduleIds: number[], newOrderIndices: number[]) => Promise<void>;
}

export const useModulesStore = create<ModulesStore>((set) => ({
    modules: [],
    isLoading: false,
    error: null,
    currentCourseId: null,

    fetchModules: async (courseId: number) => {
        set({ isLoading: true, error: null, currentCourseId: courseId });
        try {
            const modules = await ModulesRepository.getByCourse(courseId);
            // Ensure modules are sorted by order_index
            const sortedModules = modules.sort((a, b) => a.order_index - b.order_index);
            set({ modules: sortedModules });
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error('Failed to fetch modules:', error);
            set({ error: errorMessage });
            toast.error(errorMessage);
        } finally {
            set({ isLoading: false });
        }
    },

    addModule: async (courseId: number, moduleData: CreateModuleInput) => {
        set({ isLoading: true, error: null });
        try {
            const newModule = await ModulesRepository.create(courseId, moduleData);
            set((state) => ({
                modules: [...state.modules, newModule].sort((a, b) => a.order_index - b.order_index),
            }));
            toast.success('Module created successfully');
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error('Failed to create module:', error);
            toast.error(errorMessage);
            set({ error: errorMessage });
        } finally {
            set({ isLoading: false });
        }
    },

    updateModule: async (moduleId: number, moduleData: Partial<CreateModuleInput>) => {
        set({ isLoading: true, error: null });
        try {
            const updated = await ModulesRepository.update(moduleId, moduleData);
            set((state) => ({
                modules: state.modules
                    .map((m) => (m.id === moduleId ? updated : m))
                    .sort((a, b) => a.order_index - b.order_index),
            }));
            toast.success('Module updated successfully');
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error('Failed to update module:', error);
            toast.error(errorMessage);
            set({ error: errorMessage });
        } finally {
            set({ isLoading: false });
        }
    },

    deleteModule: async (moduleId: number) => {
        set({ isLoading: true, error: null });
        try {
            await ModulesRepository.delete(moduleId);
            set((state) => ({
                modules: state.modules.filter((m) => m.id !== moduleId),
            }));
            toast.success('Module deleted successfully');
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error('Failed to delete module:', error);
            toast.error(errorMessage);
            set({ error: errorMessage });
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Reorder modules (for drag and drop)
     * Updates order_index for affected modules
     * @param moduleIds - Array of module IDs in new order
     * @param newOrderIndices - Array of new order indices corresponding to module IDs
     */
    reorderModules: async (moduleIds: number[], newOrderIndices: number[]) => {
        set({ isLoading: true, error: null });
        try {
            // Update order for each module
            const updatePromises = moduleIds.map((moduleId, index) =>
                ModulesRepository.updateOrder(moduleId, newOrderIndices[index])
            );

            const updatedModules = await Promise.all(updatePromises);

            // Update local state with reordered modules
            set({
                modules: updatedModules.sort((a, b) => a.order_index - b.order_index),
            });

            toast.success('Modules reordered successfully');
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error('Failed to reorder modules:', error);
            toast.error(errorMessage);
            set({ error: errorMessage });
        } finally {
            set({ isLoading: false });
        }
    },
}));
