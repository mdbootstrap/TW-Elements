/* eslint-disable no-undef */
import { getFixture } from "./mocks.js";

describe("Button", () => {
  let fixtureEl;
  let element;

  describe("Simple button", () => {
    it("should create button", () => {
      fixtureEl = getFixture();
      fixtureEl.innerHTML = `<button type="button" id="button">Button</button>`;

      element = document.getElementById("button");

      expect(element).toBeTruthy();
    });
  });
});
