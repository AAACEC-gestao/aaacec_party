import Cookies from "js-cookie";
import axios, { AxiosResponse } from "axios";
import { JWTSigner } from "@/lib/jwt/jwt_signer";
import crypto from "crypto";

interface loginDataInterface {
  token: string;
}

interface loginResponse {
  status: number;
  role: string;
}

export default class LoginController {
  static async login(
    username: string,
    password: string
  ): Promise<loginResponse> {
    let loginData: loginDataInterface;

    try {
      const response: AxiosResponse = await axios.post("/api/v1/auth/login", {
        username,
        password,
      });
      loginData = {
        token: response.data.token,
      };
      
    } catch (e) {
      if (axios.isAxiosError(e) && e.response && e.response.status === 401) {
        return { status: 401, role: "" };
      }
      return { status: 500, role: "" };
    }
    
    const newToken = loginData.token;
    Cookies.set("token", newToken);
    const tokenInformation = await JWTSigner.verify(loginData.token);
    const role = tokenInformation.role;
  
    return { status: 200, role };
  }

  static logOut(router: any): void {
    Cookies.remove("token");
    router.replace("/");
  }
}
