const Validator = require("validatorjs");

/**
 * Helper function
 * @param telephone number to validate
 * @returns validated phone number
 */
function validatePhone(phone_number) {
  if (phone_number.length == 10 || phone_number.length <= 12) {
    //wthout country code
    let check = /^\d{10}$/.test(phone_number) ? true : false;

    if (check) {
      //add country code +1
      phone_number = `+1${phone_number}`;
    }
    return phone_number;
  } else {
    return null;
  }
}

/**
 *
 * @param {Object} object body to validate
 * @returns {Object} validated body
 */
function create(body) {
  let rules = {
    email: "required|email",
    phone: "required:string",
    password: "required|string",
    confirmPassword: "required|string|same:password",
  };
  //validate phone number's country code.
  body.phone = validatePhone(body.phone);

  let validator = new Validator(body, rules);
  return validator;
}

function login(body) {
  const rules = {
    email: "required|email",
    password: "required|string|min:6",
  };
  const validator = new Validator(body, rules);
  return validator;
}

function update(body) {
  //to update user information
  const rules = {};
  const validator = new Validator(body, rules);
  return validator;
}

module.exports = {
  create,
  login,
  update,
};
