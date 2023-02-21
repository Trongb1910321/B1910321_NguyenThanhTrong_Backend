import { createApiClient } from "./api.service";

class AuthService {
	constructor(baseUrl = "/api/auth") {
		this.api = createApiClient(baseUrl);
	}

	async login(user) {
		return (
			await this.api.post("/signin", {
				username: user.username,
				password: user.password,
			})
		).data;
	}

	async register(user) {
		return (
			await this.api.post("/signup", {
				username: user.username,
				email: user.email,
				password: user.password,


			})
		).data;
	}
}

export default new AuthService();
