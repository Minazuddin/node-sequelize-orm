const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('Users', {
        _id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        password: {
            type: DataTypes.STRING,
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
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            },
            get() {
                return this.getDataValue('first_name').toUpperCase();
            }
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            },
            get() {
                return this.getDataValue('last_name').toUpperCase();
            }
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    });

    return User;
};