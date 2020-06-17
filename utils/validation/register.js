const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {

    let errors = {};
    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";

    if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
        errors.name = 'Имя должно быть не менее двух символов';
    }

    if (Validator.isEmpty(data.name)) {
        errors.name = 'Укажите поле имени';
    }

    if (!Validator.isEmail(data.email)) {
        errors.email = 'Укажите правильный email';
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = 'Укажите email';
    }

    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = 'Пароль должен состоять не менее чем из 6 символов';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Укажите пароль';
    }

    if (!Validator.isLength(data.password2, { min: 6, max: 30 })) {
        errors.password2  = 'Пароль должен состоять не менее чем из 6 символов';
    }

    if (!Validator.equals(data.password, data.password2)) {
        errors.password2  = 'Пароли не совпадают';
    }

    if (Validator.isEmpty(data.password2)) {
        errors.password2 = 'Повторите пароль';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
