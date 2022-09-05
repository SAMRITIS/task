module.exports = (sequelize, Sequelize) => {
    try {
        const Task = sequelize.define("task", {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING,
            },
            projectId: {
                type: Sequelize.UUID,
                allowNull: false
            }
        });

        return Task;
    } catch (error) {
        console.log(error.message);
    }
};
