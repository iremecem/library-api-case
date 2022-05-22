'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
    class Loan extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Loan.belongsTo(models.User, {
                foreignKey: 'user_id',
            });
            Loan.belongsTo(models.Book, {
                foreignKey: 'book_id',
            });
        }
    }
    Loan.init(
        {
            userId: {
                field: 'user_id',
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            bookId: {
                field: 'book_id',
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'books',
                    key: 'id',
                },
            },
            isReturned: {
                field: 'is_returned',
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            userScore: {
                field: 'user_score',
                type: Sequelize.INTEGER,
                allowNull: true,
            },
        },
        {
            sequelize,
            timestamps: false,
            tableName: 'loans',
            modelName: 'Loan',
            underscored: true,
        }
    );
    Loan.removeAttribute('id');
    return Loan;
};
