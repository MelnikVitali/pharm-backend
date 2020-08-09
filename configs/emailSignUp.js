module.exports = (email, token) => ({
    from: `${process.env.EMAIL_FROM}`,
    to: `${email}`,
    subject: 'Ссылка для активации аккаунта',
    text:
        'Пожалуйста, нажмите на данную ссылку, чтобы активировать свой аккаунт\n\n'
        + `${process.env.CLIENT_URL}/email-activation?token=${token}\n\n`
        + 'Если вы не запрашивали это, игнорируйте это письмо.\n',
});
