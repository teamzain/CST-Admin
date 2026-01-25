import type { Course, CreateCourseInput, CourseFilters } from '@/api/courses';
import { coursesService } from '@/api/courses';

export class CoursesRepository {
    static async fetchAll(filters?: CourseFilters): Promise<Course[]> {
        return coursesService.getAllCourses(filters);
    }

    static async fetchById(id: number): Promise<Course> {
        return coursesService.getCourseById(id);
    }

    static async create(data: CreateCourseInput): Promise<Course> {
        return coursesService.createCourse(data);
    }

    static async update(id: number, data: Partial<CreateCourseInput>): Promise<Course> {
        return coursesService.updateCourse(id, data);
    }

    static async delete(id: number): Promise<void> {
        return coursesService.deleteCourse(id);
    }

    static async permanentDelete(id: number): Promise<void> {
        return coursesService.permanentDeleteCourse(id);
    }

    static async publish(id: number): Promise<Course> {
        return coursesService.publishCourse(id);
    }

    static async unpublish(id: number): Promise<Course> {
        return coursesService.unpublishCourse(id);
    }

    static async search(searchTerm: string): Promise<Course[]> {
        return coursesService.getAllCourses({ search: searchTerm });
    }

    static async fetchActive(): Promise<Course[]> {
        return coursesService.getAllCourses({ is_active: true });
    }
}
