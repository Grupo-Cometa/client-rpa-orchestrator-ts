"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sso = void 0;
const axios_1 = __importDefault(require("axios"));
const axios_retry_1 = __importDefault(require("axios-retry"));
class Sso {
    http;
    constructor() {
        this.http = axios_1.default.create({
            baseURL: "https://sso.viacometa.com.br/",
            headers: {
                "content-type": "application/x-www-form-urlencoded"
            }
        });
        (0, axios_retry_1.default)(this.http, {
            retries: 3,
            retryDelay: (retryCount) => {
                return retryCount * 1000;
            },
            retryCondition: (error) => {
                return (axios_retry_1.default.isNetworkError(error) ||
                    axios_retry_1.default.isRetryableError(error) ||
                    error.code === "ECONNRESET");
            },
        });
    }
    async getAccessToken() {
        const { data } = await this.http.post('realms/GC/protocol/openid-connect/token', {
            username: process.env.SSO_USERNAME,
            password: process.env.SSO_PASSWORD,
            grant_type: 'password',
            client_id: process.env.SSO_CLIENT_ID
        });
        return data.access_token;
    }
}
const sso = new Sso();
exports.sso = sso;
