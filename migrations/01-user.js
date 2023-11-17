'use strict';

/** @type {import('sequelize-cli').Migration} */
/** @type {import('bcrypt')} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    return await queryInterface.createTable('Users', {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        },
        set(password) {
          try {
            const hash = bcrypt.hashSync(password, 10);
            if (hash) this.setDataValue('password', hash);
          } catch (err) {
            console.error(err);
          }
        }
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        },
        get() {
          return this.getDataValue('first_name').toUpperCase();
        }
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        },
        get() {
          return this.getDataValue('last_name').toUpperCase();
        }
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      vehicle_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      }
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
