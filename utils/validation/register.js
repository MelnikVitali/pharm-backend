const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {

    let errors = {};
    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password_confirm = !isEmpty(data.password_confirm) ? data.password_confirm : '';

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

    if (!Validator.isLength(data.password_confirm, { min: 6, max: 30 })) {
        errors.password_confirm = 'Пароль должен состоять не менее чем из 6 символов';
    }

    if (!Validator.equals(data.password, data.password_confirm)) {
        errors.password_confirm = 'Пароли не совпадают';
    }

    if (Validator.isEmpty(data.password_confirm)) {
        errors.password_confirm = 'Повторите пароль';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
