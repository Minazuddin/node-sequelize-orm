module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        _id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            },
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        fullName: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.firstName} ${this.lastName}`;
            }
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            },
            get() {
                return `I am ${this.getDataValue('age')} years old.`
            }
        },
        dob: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        phone: {
            type: DataTypes.STRING,
            set(value) {
                this.setDataValue('phone', `+91${value}`)
            }
        }
    });

    return User;
};