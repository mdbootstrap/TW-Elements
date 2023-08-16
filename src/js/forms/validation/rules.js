const teRules = {
  required: (value) => {
    const test = value?.trim();

    if (test) {
      return true;
    }
    return "This field is required";
  },
  email: (value) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const test = pattern.test(value);

    if (test) {
      return true;
    }
    return "Please enter a valid email address";
  },
  longerThan: (value, length) => {
    const test = value.length > length;

    if (test) {
      return true;
    }

    return `This field must be longer than ${length} characters`;
  },
  shorterThan: (value, length) => {
    const test = value.length < length;

    if (test) {
      return true;
    }

    return `This field must be shorter than ${length} characters`;
  },
  isChecked: (value) => {
    if (value) {
      return true;
    }

    return "This is required";
  },
  isPhone: (value) => {
    if (value.length === 9) {
      return true;
    }
    return "Please enter a valid phone number";
  },
  isNumber: (value) => {
    if (value && !isNaN(Number(value))) {
      return true;
    }

    return "Expected value with type Number";
  },
  isString: (value) => {
    if (typeof value === "string") {
      return true;
    }

    return "Expected value with type String";
  },
  isBoolean: (value) => {
    if (typeof value === "boolean") {
      return true;
    }

    return "Expected value with type Boolean";
  },
};

export default teRules;
