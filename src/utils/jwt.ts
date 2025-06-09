import {jwtDecode} from 'jwt-decode';

export interface TokenPayload {
  name: string;
  email?: string;

  [key: string]: any; // For any additional fields
}

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    return jwtDecode<TokenPayload>(token);
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};
