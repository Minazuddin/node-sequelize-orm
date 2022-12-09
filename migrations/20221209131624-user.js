'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    const alterFirstName = () => {
      return queryInterface.changeColumn('Users', 'first_name', {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        },
        get() {
          return this.getDataValue('first_name').toUpperCase();
        }
      });
    }

    const alterLastName = () => {
      return queryInterface.changeColumn('Users', 'first_name', {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        },
        get() {
          return this.getDataValue('first_name').toUpperCase();
        }
      });
    }

    const alterPassword = () => {
      return queryInterface.changeColumn('Users', 'password', {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        },
        set(password) {
          try {
            const hash = bcrypt.hashSync(password, 10);
            this.setDataValue('password', hash);
            console.log('hash', {
              hash,
              password: this.getDataValue('password')
            })
          } catch (err) {
            console.error(err);
          }
        }
      });
    }

    await Promise.all([
      alterFirstName(),
      alterLastName(),
      alterPassword()
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
