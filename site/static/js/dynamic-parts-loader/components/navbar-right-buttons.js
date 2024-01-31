'use strict';
import { DPL } from '../dynamic-parts-loader.js';

export const navbarNewRightButtons = DPL.defineComponent({
  selector: [
    '#dpl-navbar-new-right-buttons',
    '#dpl-navbar-right-buttons-new',
    '#dpl-navbar-right-buttons',
    '#dpl-navbar-v5-legacy-right-buttons',
  ],
  template: (userData) => {
    const cartIcon = `<a
            class="mr-4 text-neutral-600 transition duration-200 hover:text-neutral-700 hover:ease-in-out focus:text-neutral-700 disabled:text-black/30 motion-reduce:transition-none dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 [&.active]:text-black/90 dark:[&.active]:text-neutral-400"
            href="https://mdbootstrap.com/cart/"
            target="_blank">
            <span class="[&>svg]:w-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="h-5 w-5">
                <path
                  d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
              </svg>
            </span>
              <span class="absolute -mt-4 ml-2.5 rounded-full bg-danger px-[0.35em] py-[0.15em] text-[0.6rem] font-bold leading-none text-white">${userData.cartContentsCount}</span>
          </a>`;

    const userNotifications = userData.notifications || [];
    const navbarNotifications = userNotifications
      .map(
        (n) => `<li>
  <a
    class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
    href="${n.link}"
    ${n.link.indexOf('getdataden.com') === -1 ? 'target="_blank" rel="nofollow"' : ''}
    data-notification-date="${n.date}"
    data-te-dropdown-item-ref
  >${n.value}</a
  >
</li>`
      )
      .join('\n');

    const loginButton = `<a class="auth-modal-toggle inline-block rounded bg-primary px-5 pb-[5px] pt-[6px] text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]" data-auth-modal-tab="sign-in">Login</a>`;

    const navbarDropdown = `<a class="hidden-arrow flex items-center whitespace-nowrap transition duration-150 ease-in-out motion-reduce:transition-none" href="#" id="dropdownMenuButton2" role="button" data-te-dropdown-toggle-ref aria-expanded="false">
  <img src="${userData.avatar}&s=24" class="rounded-full" style="height: 25px; width: 25px" alt="" loading="lazy" />
</a>
<ul
  class="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg dark:bg-neutral-700 [&[data-te-dropdown-show]]:block"
  aria-labelledby="dropdownMenuButton2"
  data-te-dropdown-menu-ref>
  <li>
    <a
      class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
      href="https://mdbootstrap.com/profile/settings"
      target="_blank"
      data-te-dropdown-item-ref
    >Account Settings</a>
  </li>
  <li>
    <a
      class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
      href="https://mdbootstrap.com/profile/my-orders"
      target="_blank"
      data-te-dropdown-item-ref
    >My Orders</a>
  </li>
  <li>
    <a
      class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
      href="https://mdbootstrap.com/support/?user=${userData.id}"
      target="_blank"
      data-te-dropdown-item-ref
    >My Questions</a>
  </li>
  <li>
    <a
      class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
      href="https://dashboard.mdbgo.com/#/projects"
      target="_blank"
      data-te-dropdown-item-ref
    >Projects</a>
  </li>
  <hr class="m-0">
  <li>
    <a
      class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
      href="https://mdbootstrap.com/snippets?user=${userData.id}&status=1&top=all"
      target="_blank"
      data-te-dropdown-item-ref
    >Public snippets</a>
  </li>
  <li>
    <a
      class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
      href="https://mdbootstrap.com/snippets?user=${userData.id}&status=4&top=all"
      target="_blank"
      data-te-dropdown-item-ref
    >Private snippets</a>
  </li>
  <li>
    <a
      class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
      href="https://mdbootstrap.com/snippets?user=${userData.id}&status=2&top=all"
      target="_blank"
      data-te-dropdown-item-ref
    >Draft snippets</a>
  </li>
        ${
          (userData.groups || []).includes('Administrator')
            ? `<li>
    <a
      class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
      href="https://mdbootstrap.com/snippets?status=4&top=all"
      target="_blank"
      data-te-dropdown-item-ref
    >All private snippets</a>
  </li>`
            : ''
        }
  <hr class="m-0">
  <li>
    <a
      class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
      href="#"
      data-logout-button-ref
      data-te-dropdown-item-ref
    >Log Out</a>
  </li>
</ul>`;

    return `<div class="relative flex items-center">
${userData.cartContentsCount > 0 ? cartIcon : ''}

<div class="relative" data-te-dropdown-ref data-te-dropdown-alignment="end">
${
  userNotifications.length > 0
    ? `<a class="hidden-arrow mr-4 flex items-center text-neutral-600 transition duration-200 hover:text-neutral-700 hover:ease-in-out focus:text-neutral-700 disabled:text-black/30 motion-reduce:transition-none dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 [&.active]:text-black/90 dark:[&.active]:text-neutral-400"
  href="#"
  id="dropdownMenuButton1"
  role="button"
  data-te-dropdown-toggle-ref
  aria-expanded="false">
  <!-- Dropdown trigger icon -->
  <span class="[&>svg]:w-5">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="h-5 w-5">
      <path
        fill-rule="evenodd"
        d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
        clip-rule="evenodd" />
    </svg>
  </span>
  <!-- Notification counter -->
  <span
    class="absolute -mt-4 ml-2.5 rounded-full bg-danger px-[0.35em] py-[0.15em] text-[0.6rem] font-bold leading-none text-white"
    >${userNotifications.length}</span
  >
</a>
<ul
              class="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg dark:bg-neutral-700 [&[data-te-dropdown-show]]:block"
              aria-labelledby="dropdownMenuButton1"
              data-te-dropdown-menu-ref>
              ${navbarNotifications}
              </ul>
`
    : ``
}
</div>
</div>

<div class="relative" data-te-dropdown-ref data-te-dropdown-alignment="end">
${userData.isLoggedIn ? navbarDropdown : loginButton}
</div>`;
  },
  mounted() {
    const tmpRightButtons = document.getElementById('dpl-navbar-right-buttons-tmp');
    const tmpRightButtonsNew = document.getElementById('dpl-navbar-right-buttons-tmp-new');
    if (tmpRightButtons) tmpRightButtons.remove();
    if (tmpRightButtonsNew) tmpRightButtonsNew.remove();

    document.addEventListener('dpl_loaded', function () {
      const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
      dropdownElementList.forEach((dropdownToggleEl) => {
        // TODO: init dropdowns
      });

      const docsAlertPlaceholder = document.querySelectorAll('.dpl-docs-alert-placeholder');
      if (docsAlertPlaceholder) docsAlertPlaceholder.forEach((e) => e.remove());

      const loginButton = document.querySelector('.auth-modal-toggle');
      const authModal = document.getElementById('navbarLogin');
      const authModalInstance = te.Modal.getOrCreateInstance(authModal);

      if (loginButton) {
        loginButton.addEventListener('click', (e) => {
          if (!authModalInstance) return;
          const allReadyOpen = document.querySelector("[data-te-open='true']");
          if (allReadyOpen && allReadyOpen !== e.target) {
            te.Modal.getInstance(allReadyOpen).hide();
          }

          authModalInstance.toggle();
        });
      }
    });
  },
});
