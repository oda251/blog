export interface Tweet {
    id?: number;
    content: string;
    author: string;
    ip_address: string;
    created_at?: string;
}

export interface Tag {
    id?: number;
    name: string;
}

export interface TweetWithTags extends Tweet {
    tagIds: number[];
}
