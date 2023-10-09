declare class Sso {
    private http;
    constructor();
    getAccessToken(): Promise<string>;
}
declare const sso: Sso;
export { sso };
