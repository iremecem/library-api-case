//intent to keep scores in a separate table
// but the library kept throwing error

'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
    class Score extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // Score.belongsTo(models.User, {
            //     foreignKey: 'user_id',
            // });
            // Score.belongsTo(models.Book, {
            //     foreignKey: 'book_id',
            // });
        }
    }
    Score.init(
        {
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            bookId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            userScore: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            timestamps: false,
            tableName: 'scores',
            modelName: 'Score',
            underscored: true,
        }
    );
    return Score;
};