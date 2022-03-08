namespace Express {
    export interface Request {
        currentUser?: CurrentUser;
    }
    export interface Response {
        currentUser?: CurrentUser;
    }
}

interface CurrentUser {
    id: string;
    email: string;
}