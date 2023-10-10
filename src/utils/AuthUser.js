import Cookies from "js-cookie";

const AuthUser = {
  isAuthorization() {
    if (Cookies.get("token")) return true;
    return null;
  },
  getAccessToken() {
    return Cookies.get("token");
  },
  signOut(navigate) {
    Cookies.remove("token");
    navigate("/login");
  },
  storeUserInfoToCookie(user) {
    if (!user.accessToken) return null;
    const { accessToken } = user;
    Cookies.set("token", accessToken, { expires: 1 });
    return user;
  },
};

export default AuthUser;
