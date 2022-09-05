const db = require("../../model");
const dotenv = require("dotenv");
const createError = require("http-errors");
const sequelize = db.sequelize;
const { v4: uuidv4 } = require("uuid");
const Task = db.task
const Project = db.project
dotenv.config();

exports.createTask = async (req, res, next) => {
    try {
        if (
            req.body.name && req.body.projectId
        ) {
            const { name, projectId } = req.body;
            await sequelize.transaction(async (transaction) => {
                await Task.create(
                    {
                        id: uuidv4(),
                        name: name,
                        userId: req.userData.id,
                        projectId: projectId
                    },
                    { transaction }
                );

                res.status(201).send({
                    status: true,
                    message: "Successfully Created Task",
                });

            });

        } else {
            next(createError(400, "Send Data in format"));
        }
    } catch (error) {
        next(createError(500, error || "Error Occoured"));
    }
};



exports.task = async (req, res, next) => {
    try {
        await sequelize.transaction(async (transaction) => {
            let TaskData;

            if (req.query.limit && req.query.pageNo) {

                const { limit, pageNo } = req.query;
                TaskData = await Task.findAll({
                    include: {
                        model: Project,
                        where: {
                            userId: req.userData.id
                        },
                        required: true,
                        attributes: []
                    },
                    limit: limit,
                    offset: (pageNo - 1) * limit,
                }, { transaction })
            }
            else {
                TaskData = await Task.findAll({
                    include: {
                        model: Project,
                        where: {
                            userId: req.userData.id
                        },
                        required: true,
                        attributes: []
                    },
                }, { transaction })
            }
            res.status(200).send({ status: true, data: TaskData })
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};


exports.updateTask = async (req, res, next) => {
    try {
        await sequelize.transaction(async (transaction) => {
            await Task.update({
                name: req.body.name
            }, {
                where: {
                    id: req.body.taskId
                },
            }, { transaction })
            res.status(200).send({ status: true, message: "Successfully Updated Task" })
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};


