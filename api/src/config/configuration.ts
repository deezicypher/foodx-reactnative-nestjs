export default () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    node_env: process.env.NODE_ENV ?? 'development',
    jwt_secret: process.env.JWT_SECRET,
    email_secret: process.env.EMAIL_SECRET,
    client_url: process.env.CLIENT_URL,
    db_username:process.env.DB_USERNAME,
    db_password:process.env.DB_PASSWORD,
    db_host:process.env.DB_HOST,
    db_port:process.env.DB_PORT,
    db_name:process.env.DB_NAME,
    mail_host:process.env.MAIL_HOST,
    mail_port:process.env.MAIL_PORT,
    mail_user:process.env.MAIL_USER,
    mail_pass:process.env.MAIL_PASS,
    sender_email:process.env.SENDER_EMAIL_ADDRESS,
    admin_email:process.env.ADMIN_EMAIL 
})