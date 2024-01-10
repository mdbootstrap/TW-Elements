/*
--------------------------------------------------------------------------
TW Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

If you would like to purchase a COMMERCIAL, non-AGPL license for TWE, please check out our pricing: https://tw-elements.com/pro/
--------------------------------------------------------------------------
*/

const Entities = require("html-entities").AllHtmlEntities;
const entities = new Entities();

class MdbSnippet {
  constructor(el) {
    this.el = el;
    this.data = [];
  }

  init() {
    this._getData();
    this._encode();
    this._replaceContent();
  }

  _getData() {
    const codeElements = Array.from(this.el.getElementsByTagName("code"));

    codeElements.forEach((codeElement) => {
      this.data.push({
        lang: codeElement.dataset.lang,
        name: codeElement.dataset.name,
        content: codeElement.innerHTML,
      });
    });
  }

  _encode() {
    this.data.forEach((data, index, arr) => {
      arr[index].content = entities.encode(data.content);
    });
  }

  _createContent() {
    const docsPills = document.createElement("div");
    const toolbar = document.createElement("div");
    const ul = document.createElement("ul");
    const tabContent = document.createElement("div");

    docsPills.setAttribute("class", "docs-pills border");
    toolbar.setAttribute("class", "d-flex justify-content-between py-2");
    toolbar.style.paddingLeft = ".6rem";
    ul.setAttribute("class", "nav nav-pills");
    tabContent.setAttribute("class", "tab-content");

    this.data.forEach((data, index) => {
      const li = document.createElement("li");
      const a = document.createElement("a");

      const tabPane = document.createElement("div");
      const codeWrapper = document.createElement("code");
      const preWrapper = document.createElement("pre");

      const id = Math.floor(
        (Math.random() + Math.floor(Math.random() * 9) + 1) * Math.pow(10, 8)
      );

      li.setAttribute("class", "nav-item");
      a.setAttribute("role", "tab");
      a.setAttribute("href", `#mdb${id}`);
      a.setAttribute("class", "nav-link");
      a.dataset.mdbToggle = "tab";
      a.innerHTML = data.name;

      li.appendChild(a);
      ul.appendChild(li);

      codeWrapper.setAttribute("class", `line-numbers language-${data.lang}`);
      codeWrapper.innerHTML = data.content;
      preWrapper.appendChild(codeWrapper);
      preWrapper.setAttribute("class", "mb-0");

      tabPane.setAttribute("role", "tabpanel");
      tabPane.setAttribute("id", `mdb${id}`);

      if (index === 0) {
        a.setAttribute("class", "nav-link active show");
        tabPane.setAttribute("class", "tab-pane fade active show");
      } else {
        a.setAttribute("class", "nav-link");
        tabPane.setAttribute("class", "tab-pane");
      }

      tabPane.appendChild(preWrapper);
      tabContent.appendChild(tabPane);
    });

    toolbar.appendChild(ul);
    docsPills.appendChild(toolbar);
    docsPills.appendChild(tabContent);
    this.el.appendChild(docsPills);
  }

  _replaceContent() {
    this._removeContent();
    this._createContent();
  }

  _removeContent() {
    this.el.innerHTML = "";
  }
}

const mdbsnippets = Array.from(document.getElementsByTagName("mdbsnippet"));
mdbsnippets.forEach((mdbsnippet) => {
  new MdbSnippet(mdbsnippet).init();
});
