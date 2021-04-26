const { todos } = require('../../models');

exports.getTodos = async (req, res) => {
    try {
        const data = await todos.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt']
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

exports.getTodo = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await todos.findOne({
            where: {
                id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
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


exports.addTodo = async (req, res) => {
    try {

        await todos.create(req.body);

        const data = await todos.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt']
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

exports.updateTodo = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        await todos.update(data, {
            where: {
                id
            }
        });

        const dataUpdate = await todos.findOne({
            where: {
                id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });

        res.send({
            status: "success",
            message: "update todo success",
            data: dataUpdate
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        const id = req.params.id;

        await todos.destroy({
            where: {
                id
            }
        });

        res.send({
            status: "success",
            message: "delete todo success",
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
