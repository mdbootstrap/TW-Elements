export function hideProDocs(userData) {
  if (userData.isProSubscription) {
    document.querySelectorAll('.mdb-pro-example').forEach(function (el) {
      const docFrag = document.createDocumentFragment();
      while (el.firstChild) {
        const child = el.removeChild(el.firstChild);
        docFrag.appendChild(child);
      }
      el.parentNode.replaceChild(docFrag, el);
    });
  } else {
    const collapseSelector = 'button[data-te-collapse-init]';

    document.querySelectorAll('.mdb-pro-example').forEach((el) => {
      // replace all pro examples with a button that opens a modal
      document.querySelectorAll(collapseSelector).forEach((codeTab) => {
        if (codeTab.parentElement.parentElement.parentElement.parentElement.contains(el)) {
          codeTab.setAttribute('data-te-toggle', 'modal');
          codeTab.removeAttribute('data-te-collapse-init');
          codeTab.setAttribute('data-te-target', '#apiRestrictedModal');
          codeTab.setAttribute('type', 'button');
          codeTab.setAttribute('href', '#');
        }
      });
    });

    const event = document.createEvent('Event');
    event.initEvent('hide_pro_docs_init', true, true);
    document.dispatchEvent(event);
  }
}
