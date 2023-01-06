export interface Gif {
    id: string;
    name: string;
    path: string;
    tags: string[];
    url?: {
        value: string;
        expires: string;
    };
    owner: string;
    token?: string;
    createdAt: string;
    updatedAt: string;
}

export enum Collections {
    Gifs = 'Gifs',
}