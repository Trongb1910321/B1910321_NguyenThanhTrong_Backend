const { ObjectId } = require("mongodb");

class UserService {
	constructor(client) {
		this.User = client.db().collection("users");
	}

	async create(payload) {
		const result = await this.User.findOneAndUpdate(
			payload,
			{ $set: payload },
			{ returnDocument: "after", upsert: true }
		);
		const { password, ...user } = result.value;
		return user;
	}

	async findOne(filter) {
		return await this.User.findOne(filter);
	}

	async findById(id) {
		return await this.User.findOne({
			_id: ObjectId.isValid(id) ? new ObjectId(id) : null,
		});
	}
}

module.exports = UserService;
