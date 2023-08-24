export const teDefaultMessages = {
  isRequired: "This is required",
  isEmail: "Please enter a valid email address",
  isLongerThan: "This field must be longer than {length} characters",
  isShorterThan: "This field must be shorter than {length} characters",
  isChecked: "This is required",
  isPhone: "Please enter a valid phone number",
  isNumber: "Expected value with type Number",
  isString: "Expected value with type String",
  isBoolean: "Expected value with type Boolean",
  isDate: "Please enter a valid date",
  is12hFormat: "Please enter a valid time in 12h format",
  is24hFormat: "Please enter a valid time in 24h format",
};

export const teRules = {
  isRequired: (value, message) => {
    const test = value?.trim();

    if (test) {
      return true;
    }
    return message;
  },
  isEmail: (value, message) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const test = pattern.test(value);

    if (test) {
      return true;
    }
    return message;
  },
  isLongerThan: (value, message, length) => {
    const test = value.length > length;

    if (test) {
      return true;
    }

    return message.replace("{length}", length);
  },
  isShorterThan: (value, message, length) => {
    const test = value.length < length;

    if (test) {
      return true;
    }

    return message.replace("{length}", length);
  },
  isChecked: (value) => {
    if (value) {
      return true;
    }

    return "This is required";
  },
  isPhone: (value, message) => {
    if (value.length === 9) {
      return true;
    }
    return message;
  },
  isNumber: (value, message) => {
    if (value && !isNaN(Number(value))) {
      return true;
    }

    return message;
  },
  isString: (value, message) => {
    if (typeof value === "string") {
      return true;
    }

    return message;
  },
  isBoolean: (value, message) => {
    if (typeof value === "boolean") {
      return true;
    }

    return message;
  },
  isDate: (value, message) => {
    const pattern = /^([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{4})$/;
    const test = value.match(pattern);

    if (test) {
      return true;
    }

    return message;
  },
  is12hFormat: (value, message) => {
    const pattern = /^(0?[1-9]|1[0-2]):[0-5][0-9] [APap][mM]$/;
    const test = value.match(pattern);

    if (test) {
      return true;
    }

    return message;
  },
  is24hFormat: (value, message) => {
    const pattern = /^(?:[01]\d|2[0-3]):[0-5][0-9]$/;
    const test = value.match(pattern);

    if (test) {
      return true;
    }

    return message;
  },
};
