const checkPassword = (password) => {
    var pattern1 = new RegExp(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/
    );
    if (pattern1.test(password)) {
        return true;
    }
    return false;
};

module.exports = checkPassword;
