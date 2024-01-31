import { DPL } from './dynamic-parts-loader/dynamic-parts-loader.js';
import { authModal } from './dynamic-parts-loader/components/auth-modals.js';
import { navbarNewRightButtons } from './dynamic-parts-loader/components/navbar-right-buttons.js';
import { proComponentMarkerClass, proComponentMarkerId } from './dynamic-parts-loader/components/pro-marker.js';
import { hideProDocs } from './hide-pro-docs.js';
import { isUserSubProGlobal } from './dynamic-parts-loader/components/mdb4/is-user-sub-pro-global.js';

window.addEventListener('DOMContentLoaded', () => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `${CONFIG.docsApiUrl}/user`, true);
  xhr.withCredentials = true;

  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onreadystatechange = function () {
    const mdb5Components = [
      authModal,
      navbarNewRightButtons,
      proComponentMarkerId,
      proComponentMarkerClass,
      isUserSubProGlobal,
    ];

    if (this.readyState === XMLHttpRequest.DONE && this.status >= 200 && this.status < 300) {
      const { user, notifications } = JSON.parse(xhr.response);
      hideProDocs({ ...user, notifications, isLoggedIn: true });
      DPL.run({
        userData: { ...user, notifications, isLoggedIn: true },
        components: [...mdb5Components],
      });
    } else if (this.readyState === XMLHttpRequest.DONE && this.status === 401) {
      const { notifications } = JSON.parse(xhr.response);
      hideProDocs({ isLoggedIn: false });
      DPL.run({
        userData: { notifications, isLoggedIn: false },
        components: [...mdb5Components],
      });
    }
  };

  xhr.send(null);
});
