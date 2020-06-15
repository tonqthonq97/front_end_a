export class User {
    constructor(
        public email: string,
        public id: number,
        private _token: string,
        private device: string,
        private fbToken: string
    ) {}

    get token() {
        // if (!this._expiresAt || new Date() > this._expiresAt) {
        //     return null;
        // }
        return this._token;
    }
}
