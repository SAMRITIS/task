const db = require("../../model");
const User = db.user;
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const sequelize = db.sequelize;

const auth = () => {
    try {
        return async (req, res, next) => {
            if (req.header("authorization")) {
                let tokenData = await jwt.verify(
                    req.header("authorization").split(" ")[1],
                    process.env.JWT_TOKEN_SECRET
                );
                await sequelize.transaction(async (transaction) => {
                    if (tokenData) {

                        let userData = await User.findOne(
                            {
                                where: { id: tokenData.userId },
                            },
                            { transaction }
                        );

                        if (userData) {
                            if (
                                parseInt(userData.dataValues.passwordChangeTime) <=
                                parseInt(tokenData.tokenGenerationTime)
                            ) {
                                req.tokenData = tokenData;
                                req.userData = userData;
                                next();
                            }
                            else {
                                return next(createError(401, "You are't authorized"));
                            }
                        } else {
                            return next(createError(401, "You are't authorized"));
                        }
                    } else {
                        return next(createError(401, "You are't authorized"));
                    }
                });
            }
            else {
                return next(createError(401, "You are't authorized"));
            }

        };
    } catch (error) {
        return next(createError(401, "You are't authorized"));
    }
};

module.exports = auth;
