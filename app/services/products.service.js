const { ObjectId } = require("mongodb");

class ContactService {
	constructor(ownerId, client) {
		this.ownerId = ObjectId.isValid(ownerId) ? new ObjectId(ownerId) : null;
		this.Contact = client.db().collection("products");
	}

	async create(payload) {
		const contact = {
			id: payload.id,
			title: payload.title,
			picture: payload.picture,
			description: payload.description,
			price: payload.price,

		};
		// As collection.insertOne() doesn't return the inserted document,
		// we need to use collection.findOneAndUpdate to get the inserted document
		const result = await this.Contact.findOneAndUpdate(
			contact,
			{ $set: { favorite: payload.favorite === true } },
			{ returnDocument: "after", upsert: true }
		);
		return result.value;
	}

	async find(filter) {
		const cursor = await this.Contact.find({
			...filter,
			ownerId: this.ownerId,
		});
		return await cursor.toArray();
	}

	async findFavorite() {
		return await this.find({
			favorite: true,
			ownerId: this.ownerId,
		});
	}

	async findByName(name) {
		return await this.find({
			name: { $regex: new RegExp(name), $options: "i" },
			ownerId: this.ownerId,
		});
	}

	async findById(id) {
		return await this.Contact.findOne({
			_id: ObjectId.isValid(id) ? new ObjectId(id) : null,
			ownerId: this.ownerId,
		});
	}

	async update(id, payload) {
		const filter = {
			_id: ObjectId.isValid(id) ? new ObjectId(id) : null,
			ownerId: this.ownerId,
		};
		// Don't want to put _id and ObjectId types in the $set object
		const { _id, ownerId, ...update } = payload;
		const result = await this.Contact.findOneAndUpdate(
			filter,
			{ $set: update },
			{ returnDocument: "after" }
		);
		return result.value;
	}

	async delete(id) {
		const result = await this.Contact.findOneAndDelete({
			_id: ObjectId.isValid(id) ? new ObjectId(id) : null,
			ownerId: this.ownerId,
		});
		return result.value;
	}

	async deleteAll() {
		const result = await this.Contact.deleteMany({
			ownerId: this.ownerId,
		});
		return result.deletedCount;
	}
}

module.exports = ContactService;
