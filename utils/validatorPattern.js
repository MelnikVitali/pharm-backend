module.exports = {
    name: {
        name: "name",
        reg: /^[A-Za-zА-Яа-я\-]{2,}\s[A-Za-zА-Яа-я\-\s]{2,}$/,
        error: "The field must consist of the fist and the last names, more than 2 symbols each.",
        required: "Please add a name"
    },
    title: {
        name: 'name',
        req: /^$|^.{2,255}$/,
        error: 'Название должно содержать не менее двух символов!',
        required: 'Название должно быть указано!'

    },
    integerPosition: {
        name: 'integerPosition',
        req: /^\d+$/,
        error: 'Номер позиции не является целым положительным числом!',
        required: 'Позиция пункта меню должна быть указана!'
    },
    email: {
        name: "email",
        reg: /^[a-z0-9]+[\w\-\.]*[a-z0-9]+\@[a-z0-9]+[\w\-\.]*[a-z0-9]+\.[a-z]{2,}$/,
        error: "Please enter a valid e-mail address.",
        required: "Please add an e-mail"
    },
    password: {
        name: "password",
        reg: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[\w!@#\$%\^&-\*]{6,}$/,
        error: "Password must contain not less than 6 symbols, including upper case, lower case, digits and special" +
            " symbols.",
        required: "Please add a password"
    },

    phone: {
        name: "phone",
        reg: /^[+\s]?\(?\s?\d*[\s\-]?\)?\(?\s?\d{3,}[\s\-]?\)?\s?\d{1,3}[\s\-]?\d{2}[\s\-]?\d{2}$/,
        error: "Please enter a valid phone number.",
        required: "Please add a phone"
    },

    department: {
        name: "department",
        reg: /[\wА-Яа-я\-\&\s]{2,}/,
        error: "Department name must consist of not less than two symbols.",
    },
    role: {
        name: "role",
        reg: /^(owner)|(admin)|(content manager)$/,
        error: "Role value must be only owner, admin or content manager.",
        required: "Please choose a role"
    }
};
