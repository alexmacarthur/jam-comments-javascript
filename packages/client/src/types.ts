export interface Comment {
    content: string;
    created_at: string;
    id: number;
    name: string;
    parent_comment_id?: number;
    site: number;
    status: string;
}
