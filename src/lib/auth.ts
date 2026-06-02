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

export const getSession = (cookieHeader?: string) => {
  const cookieString = cookieHeader || (typeof document !== "undefined" ? document.cookie : "");
  const cookies = cookieString.split(";").map((item) => item.trim());
  const sessionCookie = cookies.find((item) => item.startsWith("aura_admin_session="));
  return sessionCookie ? sessionCookie.split("=")[1] : null;
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
