class InitRegister {
  constructor() {
    this.inits = [];
  }

  get initialized() {
    return this.inits;
  }

  isInited(componentName) {
    return this.inits.includes(componentName);
  }

  add(componentName) {
    this.inits.push(componentName);
  }
}

export default InitRegister;
