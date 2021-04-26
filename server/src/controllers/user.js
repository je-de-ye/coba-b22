const { user } = require('../../models');
const joi = require('joi');

exports.getUsers = async (req, res) => {
    try {
        let data = await user.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password']
            }
        });

        const parseJSON = JSON.parse(JSON.stringify(data));

        const path = "http://localhost:5000/uploads/";
        data = parseJSON.map(item => {
            return {
                ...item,
                image: path + item.image
            }
        });

        res.send({
            status: "success",
            data
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
};

exports.getUser = async (req, res) => {
    try {
        const id = req.params.id;
        let data = await user.findOne({
            where: {
                id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password']
            }
        });

        const path = "http://localhost:5000/uploads/";
        data = {
            ...data.dataValues,
            image: path + data.image
        };

        res.send({
            status: "success",
            data: {
                user: data
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
};

exports.updateUser = async (req, res) => {
    try {
        const path = "http://localhost:5000/uploads/";
        const id = req.userId.id;
        const data = req.body;


        const userSelected = await user.findOne({
            where: {
                id,
            },
            attributes: {
                exclude: ["password", "createdAt", "updatedAt"]
            }
        });

        if (!userSelected) {
            return res.status(404).send({
                status: "Error",
                message: "User doesn't exist",
            });
        }

        if (userSelected && userSelected.id !== req.userId.id) {
            return res.status(402).send({
                status: "Error",
                message: "You haven't authorization for edit this user"
            });
        }

        const shcema = joi.object({
            name: joi.string().min(3).max(50),
            email: joi.string().email().max(50),
            image: joi.string(),
        });

        const { error } = shcema.validate(data);

        if (error) {
            return res.status(400).send({
                status: "There's error in your data input",
                message: error.details[0].message,
            });
        }

        let newImage;

        if (req.files.imageFile === undefined) {
            newImage = userSelected.image;
        } else {
            newImage = req.files.imageFile[0].filename;
        }

        const userUpdated = {
            ...req.body,
            image: newImage
        }

        await user.update(userUpdated, {
            where: {
                id
            }
        });

        let dataUser = await user.findOne({
            where: { id },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password']
            }
        });

        dataUser = {
            ...dataUser.dataValues,
            image: path + dataUser.image
        }

        res.send({
            status: "success",
            message: "Update user data Success",
            data: {
                user: dataUser
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.id;

        await user.destroy({
            where: {
                id
            }
        });

        res.send({
            status: "success",
            message: "delete user success",
            data: {
                id
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
}