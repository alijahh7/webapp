const bcrypt = require('bcrypt');
//https://medium.com/@arunchaitanya/salting-and-hashing-passwords-with-bcrypt-js-a-comprehensive-guide-f5e31de3c40c#:~:text=Example%201%3A%20User%20Registration

const passwordHasher = async (password) => {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword

}

module.exports=passwordHasher;