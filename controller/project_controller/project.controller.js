const db = require("../../model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const createError = require("http-errors");
const sequelize = db.sequelize;
const passwordValidator = require("../../helper/passwordValidator");
const emailValidator = require("../../helper/emailValidator")
const { v4: uuidv4 } = require("uuid");
const { project } = require("../../model");
const User = db.user;
const Project = db.project
const Task = db.task
dotenv.config();

exports.createProject = async (req, res, next) => {
    try {
        if (
            req.body.name
        ) {
            const { name } = req.body;
            await sequelize.transaction(async (transaction) => {

                await Project.create(
                    {
                        id: uuidv4(),
                        name: name,
                        userId: req.userData.id
                    },
                    { transaction }
                );

                res.status(201).send({
                    status: true,
                    message: "Successfully Created Project",
                });

            });

        } else {
            next(createError(400, "Send Data in format"));
        }
    } catch (error) {
        next(createError(500, error || "Error Occoured"));
    }
};



exports.project = async (req, res, next) => {
    try {
        await sequelize.transaction(async (transaction) => {
            let projectData;
            if (req.query.limit && req.query.pageNo) {
                const { limit, pageNo } = req.query;
                projectData = await Project.findAll({
                    where: {
                        userId: req.userData.id
                    },
                    include: {
                        model: Task
                    },
                    limit: limit,
                    offset: (pageNo - 1) * limit,
                }, { transaction })
            }
            else {
                projectData = await Project.findAll({
                    where: {
                        userId: req.userData.id
                    },
                    include: {
                        model: Task
                    },

                }, { transaction })
            }
            res.status(200).send({ status: true, data: projectData })
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};


exports.updateProject = async (req, res, next) => {
    try {
        await sequelize.transaction(async (transaction) => {
            await Project.update({
                name: req.body.name
            }, {
                where: {
                    id: req.body.projectId
                },
            }, { transaction })
            res.status(200).send({ status: true, message: "Successfully Updated Project" })
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};


