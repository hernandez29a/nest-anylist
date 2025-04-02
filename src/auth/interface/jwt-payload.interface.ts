
export interface JwtPayload {
    id: string;
    iat: number; // Fecha de creación del token
    exp: number; // Fecha de expiración del token
    // Puedes agregar más propiedades según tus necesidades 
}