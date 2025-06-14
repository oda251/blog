export function authenticateAdmin(password: string): boolean {
  return process.env.ADMIN_PASSWORD === password;
}
