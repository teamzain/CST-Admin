export type LessonContentType = 'video' | 'pdf' | 'text';

export interface Lesson {
    id: number;
    title: string;
    content_type: LessonContentType;
    duration_min?: number;
    order_index: number;
    description?: string;
    content_url?: string;
    pdf_url?: string;
    content_text?: string;
    enable_download?: boolean;
    course_id?: number;
    module_id?: number;
    bunny_video_id?: string;
    bunny_library_id?: number;
    bunny_collection_id?: string;
    video_status?: string;
    thumbnail_url?: string;
    video_length?: number;
    course?: {
        id: number;
        title: string;
    };
    module?: {
        id: number;
        title: string;
    };
}

export interface CreateLessonInput {
    title: string;
    content_type: LessonContentType;
    duration_min?: number;
    order_index?: number;
    description?: string;
    content_url?: string;
    pdf_url?: string;
    content_text?: string;
    enable_download?: boolean;
    module_id?: number;
}

export type UpdateLessonInput = Partial<CreateLessonInput>;

export interface LessonFilters {
    course_id?: number;
    module_id?: number;
    content_type?: LessonContentType;
    search?: string;
}
