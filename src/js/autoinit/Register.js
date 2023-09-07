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
    if (!this.isInited(componentName)) {
      this.inits.push(componentName);
    }
  }
}

export default InitRegister;
