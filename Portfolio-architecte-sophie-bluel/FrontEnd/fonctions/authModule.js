export default class AuthModule {
  constructor() {
    //Création de la WhiteList
    this.authOrigins = [
      "http://127.0.0.1:5500/Portfolio-architecte-sophie-bluel/FrontEnd/index.html",
      "http://127.0.0.1:5500/Portfolio-architecte-sophie-bluel/FrontEnd/login.html",
      "http://127.0.0.1:5500/Portfolio-architecte-sophie-bluel/FrontEnd/modale.html",
      "http://localhost:5678",
    ];
    this.token = null;
  }

  setToken(value) {
    this.token = value;
  }

  getToken() {
    return this.token;
  }

  fetch(resource, options) {
    let req = new Request(resource, options);
    let destOrigin = new URL(req.url).origin;
    if (this.token && this.authOrigins.includes(destOrigin)) {
      req.headers.set("Authorization", `Bearer ${this.token}`);
    }
    return fetch(req);
  }
}
