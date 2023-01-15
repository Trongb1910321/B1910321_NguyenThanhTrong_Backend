const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const ContactService = require("../services/contact.service");
//Create and save a new contact
exports.create = async (req, res, next) => {
    if (!req.body?.name){
        return next (new ApiError(400, "Name can not be empty"));
    }
    try {
        const ContactServices = new ContactService(MongoDB.client);
        const document = await ContactServices.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the contact")
        );
    }
};
exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const ContactServices = new ContactService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await ContactServices.findByName(name);
        } else {
            documents = await ContactServices.find({});
        }
    } catch (error){
        return next (
            new ApiError(500, "An error occurred while retrieving contacts")
        );
    }
    return res.send(documents);
};
//Find sigle contact with an id
exports.findOne = async (req, res, next) => {
    try{
        const ContactServices = new ContactService(MongoDB.client);
        const document = await ContactServices.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Error retrieving contact with id=${req.params.id}`
            )
        );
    }
};

exports.update = async(req, res, next) => {
    if (Object.keys(req.body).length === 0){
        return next (new ApiError(400, "Data to update can not be empty"));    
    }
    try {
        const ContactServices = new ContactService(MongoDB.client);
        const document = await ContactServices.update(req.params.id, req.body);
        if (!document) {
            return next (new ApiError(404, "Contact not found"));
        }
        return res.send({ message: "Contact was updated successfully"});
    } catch (error) {
        return next (
            new ApiError(500, `Error updating contact with id=${req.params.id}`)
        );
    }
};

exports.delete = async(req, res, next) => {
    try {
        const ContactServices = new ContactService (MongoDB.client);
        const document = await ContactServices.delete (req.params.id);
        if (!document) {
            return next (new ApiError(404, "Contact not found"));
        }
        return res.send({ message: "Contact was deleted successfully" });
    } catch (error) {
        return next (
            new ApiError (
                500,
                `Could not delete contact with id=${req.params.id}`
            )
        );
    }
};

exports.deleteAll = async(req, res, next) => {
    try {
        const ContactServices = new ContactService(MongoDB.client);
        const deletedCount = await ContactServices.deleteAll();
        return res.send ({
            message: `${deletedCount} contacts were deleted successfully`, 
        });
    } catch (error){
        return next (
            new ApiError(500, "An error occurred while removing all contacts")
        );
    }
};

exports.findAllFavorite = async(_req, res, next) => {
    try {
        const ContactServices = new ContactService(MongoDB.client);
        const documents = await ContactServices.findFavorite();
        return res.send(documents);
    }catch (error) {
        return next (
            new ApiError(
                500,
                "An error occurred while retrieving favorite contacts"
            )
        );
    }
};



