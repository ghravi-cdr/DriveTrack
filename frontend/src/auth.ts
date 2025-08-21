export type User = { _id: string; email: string; full_name?: string | null };

export const Auth = {
  user(): User | null {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  },
  set(token: string, user: User) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}