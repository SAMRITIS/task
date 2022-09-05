const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    operatorsAliases: "0",
    logging: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.user = require("./user_model/user.model")(
    sequelize,
    Sequelize
);
db.project = require("./project_model/project.model")(sequelize, Sequelize);
db.task = require("./task_model/task.model")(
    sequelize,
    Sequelize
);


db.user.hasMany(db.project, {
    foreignKey: "userId",
    onDelete: "CASCADE",
});
db.project.belongsTo(db.user, {
    foreignKey: "userId",
});


db.project.hasMany(db.task, {
    foreignKey: "projectId",
    onDelete: "CASCADE",
});
db.task.belongsTo(db.project, {
    foreignKey: "projectId",
});

module.exports = db;