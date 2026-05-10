export const setSession = () => {
  if (typeof document !== "undefined") {
    document.cookie = "aura_admin_session=true; path=/; SameSite=Strict";
  }
};

export const clearSession = () => {
  if (typeof document !== "undefined") {
    document.cookie = "aura_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
};

export const isAuthenticated = (cookieHeader?: string) => {
  const cookieString = cookieHeader || (typeof document !== "undefined" ? document.cookie : "");
  return cookieString.split(";").some((item) => item.trim() === "aura_admin_session=true");
};
