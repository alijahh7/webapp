

const validateName = (input) => {
    nameRegex=/^[a-zA-Z\s]+$/;
    return nameRegex.test(input);
}

module.exports={validateName};