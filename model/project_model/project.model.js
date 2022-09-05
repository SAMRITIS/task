module.exports = (sequelize, Sequelize) => {
    try {
        const Project = sequelize.define("project", {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING,
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: false
            }
        });

        return Project;
    } catch (error) {
        console.log(error.message);
    }
};
