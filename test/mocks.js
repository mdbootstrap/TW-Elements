const fixtureId = "fixture";

export const getFixture = () => {
  let fixtureEl = document.getElementById(fixtureId);

  if (!fixtureEl) {
    fixtureEl = document.createElement("div");
    fixtureEl.setAttribute("id", fixtureId);
    fixtureEl.style.position = "absolute";
    fixtureEl.style.top = "-10000px";
    fixtureEl.style.left = "-10000px";
    fixtureEl.style.width = "10000px";
    fixtureEl.style.height = "10000px";
    document.body.appendChild(fixtureEl);
  }

  return fixtureEl;
};

export const clearFixture = () => {
  const fixtureEl = getFixture();

  fixtureEl.innerHTML = "";
};
