import axios, { AxiosInstance } from "axios";
import axiosRetry from "axios-retry";

class Sso {
  private http: AxiosInstance

  constructor() {
    this.http = axios.create({
      baseURL: "https://sso.viacometa.com.br/",
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      timeout: 10000
    });

    axiosRetry(this.http, {
      retries: 3,
      retryDelay: (retryCount) => {
        return retryCount * 1000
      },
      retryCondition: (error) => {
        return (
          axiosRetry.isNetworkError(error) ||
          axiosRetry.isRetryableError(error) ||
          error.code === "ECONNRESET"
        );
      },
    })
  }

  async getAccessToken(): Promise<string>
  {
    const { data } = await this.http.post('realms/GC/protocol/openid-connect/token', {
      username: process.env.SSO_USERNAME,
      password: process.env.SSO_PASSWORD,
      grant_type: 'password',
      client_id: process.env.SSO_CLIENT_ID
    })

    return data.access_token;
  }
}

const sso = new Sso()
export { sso };