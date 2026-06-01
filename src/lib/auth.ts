export const setSession = (token: string) => {
  if (typeof document !== "undefined") {
    document.cookie = `aura_admin_session=${token}; path=/; SameSite=Strict`;
  }
};

export const clearSession = () => {
  if (typeof document !== "undefined") {
    document.cookie = "aura_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
};

export const isAuthenticated = (cookieHeader?: string) => {
  const cookieString = cookieHeader || (typeof document !== "undefined" ? document.cookie : "");
  const cookies = cookieString.split(";").map((item) => item.trim());
  return cookies.some((item) => item.startsWith("aura_admin_session=") && item.split("=")[1]?.length > 0);
};

//   const cookies = cookieString.split(";").map((item) => item.trim());
//   return cookies.some((item)=> item.startsWith("aura_admin_session=") && item.split("=")[1]?.length > 0);
// };
// const cookies = cookieString.split(";").map((item) => item.trim());
// return cookies.some((item) => item.startsWith("aura_admin_session=") && item.split("=")[1]?.length > 0);
//    };
