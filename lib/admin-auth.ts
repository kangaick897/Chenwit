const fallbackAdminEmailDomain = "chenwit-house-builder.com";

export function resolveAdminEmail(login: string) {
  const normalizedLogin = login.trim().toLowerCase();

  if (normalizedLogin.includes("@")) {
    return normalizedLogin;
  }

  const domain = process.env.ADMIN_LOGIN_DOMAIN ?? fallbackAdminEmailDomain;

  return `${normalizedLogin}@${domain}`;
}
