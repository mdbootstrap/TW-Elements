/* eslint-disable no-undef */
import { clearFixture, getFixture } from "./mocks";
import initTE from "../src/js/autoinit/index.js";

describe("Alert", () => {
  let fixtureEl;

  beforeEach(() => {
    fixtureEl = getFixture();
  });

  afterEach(() => {
    clearFixture();
  });

  it("should initialize an Alert by a data attribute and remove it on dispose", () => {
    fixtureEl.setAttribute("data-te-alert-init", "");
    fixtureEl.setAttribute("data-te-dismiss", "alert");
    jest.resetModules();

    const Alert = require("../src/js/components/alert").default; // eslint-disable-line global-require
    initTE({ Alert });

    let instance = Alert.getInstance(fixtureEl);

    expect(instance).not.toEqual(null);

    instance.dispose();

    instance = Alert.getInstance(fixtureEl);
    expect(instance).toEqual(null);
  });
});
