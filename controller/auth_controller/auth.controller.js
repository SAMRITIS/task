const db = require("../../model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const saltRounds = 12
const createError = require("http-errors");
const sequelize = db.sequelize;
const passwordValidator = require("../../helper/passwordValidator");
const emailValidator = require("../../helper/emailValidator")
const { v4: uuidv4 } = require("uuid");
const User = db.user;
dotenv.config();

exports.signUp = async (req, res, next) => {
    try {
        if (
            req.body.name,
            req.body.email &&
            req.body.password &&
            emailValidator(req.body.email)
        ) {
            const { email, password, name } = req.body;
            if (

                passwordValidator(password)
            ) {
                await sequelize.transaction(async (transaction) => {
                    await User.create(
                        {
                            id: uuidv4(),
                            name: name,
                            email: email,
                            password: await bcrypt.hashSync(
                                password,
                                saltRounds
                            ),
                            passwordChangeTime: parseInt(
                                new Date().getTime() / 1000
                            ),
                        },
                        { transaction }
                    );

                    res.status(201).send({
                        status: true,
                        message: "Successfully Signup",
                    });

                });
            } else {
                next(
                    createError(
                        400,
                        "Password should contain atleast one special character, number, capital, small letter and password length should be minimum 8 and Password, confirm password should be same "
                    )
                );
            }
        } else {
            next(createError(400, "Send Data in format"));
        }
    } catch (error) {
        next(createError(500, error || "Error Occoured"));
    }

};



exports.signIn = async (req, res, next) => {
    if (req.body.email && req.body.password) {
        try {
            await sequelize.transaction(async (transaction) => {
                const { email, password } = req.body;
                let userData = await User.findOne(
                    {
                        where: { email: email },
                    },
                    { transaction }
                );
                if (userData) {
                    if (
                        await bcrypt.compare(
                            password,
                            userData.dataValues.password
                        )
                    ) {
                        let token = await jwt.sign(
                            {
                                userId: userData.id,
                                tokenGenerationTime: parseInt(new Date().getTime() / 1000),
                            },
                            process.env.JWT_TOKEN_SECRET,
                            { expiresIn: "720h" }
                        );

                        res.status(200).send({
                            status: true,
                            message: "Successfully Loginned",
                            token: token,
                        });

                    } else {
                        next(createError(401, "Email or Password is wrong"));
                    }
                } else {
                    next(createError(400, "Email or Password is wrong"));
                }
            });
        } catch (error) {
            next(createError(500, error.message));
        }
    } else {
        next(createError(400, "Email Password Required"));
    }
};

exports.logOut = async (req, res, next) => {
    try {
        await sequelize.transaction(async (transaction) => {
            await User.update(
                {
                    passwordChangeTime: parseInt(
                        new Date().getTime() / 1000
                    ),
                }, {
                where: {
                    id: req.userData.id
                }
            },
                { transaction }
            );

            res.status(201).send({
                status: true,
                message: "Successfully Logout",
            });

        });


    } catch (error) {
        next(createError(500, error || "Error Occoured"));
    }

}
