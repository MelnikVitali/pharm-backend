module.exports = (email, token) => ({
    from: `${process.env.EMAIL_FROM}`, //authorize link to https://myaccount.google.com/lesssecureapps
    to: `${email}`,
    subject: 'Ссылка для сброса пароля',
    text:
        'Вы получаете это письмо, потому что вы (или кто-то еще) запросили сброс пароля для вашей учетной записи.\n\n'
        + 'Пожалуйста, нажмите на следующую ссылку или вставьте ее в браузер, чтобы завершить процесс в течение одного часа после ее получения:\n\n'
        + `${process.env.CLIENT_URL}/reset-password?token=${token}\n\n`
        + 'Если вы не запрашивали это, игнорируйте это письмо, и ваш пароль останется без изменений.\n',
});
