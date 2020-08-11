module.exports = (email, token, reqHeadersOrigin) => ({
    from: `${process.env.EMAIL_FROM}`,
    to: `${email}`,
    subject: 'Ссылка для активации аккаунта',
    text:
        'Пожалуйста, нажмите на данную ссылку, чтобы активировать свой аккаунт\n\n'
        + `${reqHeadersOrigin}/email-activation?token=${token}\n\n`
        + 'Если вы не запрашивали это, игнорируйте это письмо.\n',
});
