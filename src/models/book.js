'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
    class Book extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Book.belongsToMany(models.User, {
                
                through: 'loans',
                foreignKey: 'book_id',
            });

            Book.hasMany(models.Loan);

            // Book.belongsToMany(models.User, {
            //     through: 'scores',
            //     foreignKey: 'book_id',
            // });
        }
    }
    Book.init(
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
            timestamps: false,
            sequelize,
            tableName: 'books',
            modelName: 'Book',
            underscored: true,
        }
    );
    return Book;
};
