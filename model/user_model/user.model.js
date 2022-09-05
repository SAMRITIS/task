module.exports = (sequelize, Sequelize) => {
    try {
        const User = sequelize.define("user", {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
                validate: {
                    isEmail: true
                }
            },
            password: {
                type: Sequelize.STRING,
            },
            passwordChangeTime: {
                type: Sequelize.INTEGER,
            }
        });

        return User;
    } catch (error) {
        console.log(error.message);
    }
};
