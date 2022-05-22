'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.belongsToMany(models.Book, {
                through: 'loans',
                foreignKey: 'user_id',
            });

            User.hasMany(models.Loan);

            // User.belongsToMany(models.Book, {
            //     as: 'scored_books',
            //     through: 'scores',
            //     foreignKey: 'user_id',
            // });
        }
    }
    User.init(
        {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
        },
        {
            sequelize,
            timestamps: false,
            tableName: 'users',
            modelName: 'User',
            underscored: true,
        }
    );
    return User;
};
