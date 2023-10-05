import jwt, { Secret } from 'jsonwebtoken';

// Define the payload type
interface JwtPayload {
  // Define the properties you expect in your payload
  userId: string;
  name:string;
  email: string;
  // Add other properties as needed
}

export function signJwtToken(payload: JwtPayload, options: jwt.SignOptions = {}): string {
  const secret: Secret | undefined = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in your environment variables.');
  }

  const token = jwt.sign(payload, secret, options);
  return token;
}

export function verifyJwtToken(token: string): JwtPayload | null {
  const secret: Secret | undefined = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in your environment variables.');
  }

  try {
    const payload = jwt.verify(token, secret) as JwtPayload;
    return payload;
  } catch (error) {
    console.error(error);
    return null;
  }
}
