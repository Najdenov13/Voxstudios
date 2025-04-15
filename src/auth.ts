import { NextRequest } from 'next/server';
import Cookies from 'js-cookie';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthResult {
  isAuthenticated: boolean;
  user: User | null;
}

export async function auth(request: NextRequest): Promise<AuthResult> {
  const userCookie = request.cookies.get('user')?.value;
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true';

  if (!isAuthenticated || !userCookie) {
    return { isAuthenticated: false, user: null };
  }

  try {
    const user = JSON.parse(userCookie);
    if (!user || !user.id || !user.email || !user.role) {
      return { isAuthenticated: false, user: null };
    }
    return { isAuthenticated: true, user };
  } catch {
    return { isAuthenticated: false, user: null };
  }
} 