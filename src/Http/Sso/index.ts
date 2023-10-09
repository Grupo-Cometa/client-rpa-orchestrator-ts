import axios, { Axios } from "axios";

class Sso {
  private http: Axios

  constructor() {
    this.http = axios.create({
      baseURL: "https://sso.viacometa.com.br/",
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
    });
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