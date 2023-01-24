export interface User {
    id?: number;
    username: string;
    email: string;
    password?: string;
    adresse: string;
    city: string;
    postalCode: string;
    role_id?: number;
}
