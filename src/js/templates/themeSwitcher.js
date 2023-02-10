export const switcherTemplate = `
<div class="fixed right-5 bottom-5 z-[9999]" id="theme-switcher">
  <button
    class="w-[30px] h-[30px] text-neutral-800 dark:text-white uppercase rounded-full hover:shadow-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 focus:bg-neutral-300 dark:focus:bg-neutral-700 focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out flex items-center justify-center whitespace-nowrap motion-reduce:transition-none"
    type="button" id="themeSwitcher" data-te-dropdown-toggle-ref aria-expanded="false">
    <svg xmlns="http://www.w3.org/2000/svg" data-theme-icon aria-hidden="true" focusable="false"
      class="w-3" role="img" 
      viewBox="0 0 384 512">
      <path fill="currentColor"
        d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z" />
    </svg>
  </button>
  <ul
    class="min-w-max absolute bg-white text-base z-[1000] overflow-hidden float-left list-none text-left rounded-lg shadow-lg hidden m-0 bg-clip-padding border-none [&[data-te-dropdown-show]]:block dark:bg-neutral-800"
    aria-labelledby="themeSwitcher" data-te-dropdown-menu-ref>
    <li class="scale-[0.8] text py-1 flex justify-center items-center text-gray-400 font-bold">
      <svg class="-ml-1 fill-gray-400" xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="M7 17v-5.792H3L10 2l7 9.208h-4V17Zm1.5-1.5h3V9.708h2.438L10 4.438l-3.938 5.27H8.5ZM10 9.708Z"/></svg>
      <span class="ml-1 mr-2">+</span>
      <span>D</span>
    <li>
      <a class="text-sm py-2 px-3 font-normal block w-full whitespace-nowrap bg-transparent text-neutral-700 dark:text-neutral-100 hover:bg-neutral-100 disabled:text-neutral-400 disabled:pointer-events-none disabled:bg-transparent active:no-underline active:text-neutral-800 dark:hover:bg-neutral-600 focus:outline-none focus:bg-neutral-200 focus:dark:bg-neutral-600"
        href="#" data-theme="light" data-te-dropdown-item-ref>
        <div class="pointer-events-none">
          <div class="inline-block w-[24px] text-center" data-theme-icon="light">
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"
              class="inline-block w-4" role="img" viewBox="0 0 512 512">
              <path fill="currentColor"
                d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM352 256c0 53-43 96-96 96s-96-43-96-96s43-96 96-96s96 43 96 96zm32 0c0-70.7-57.3-128-128-128s-128 57.3-128 128s57.3 128 128 128s128-57.3 128-128z" />
            </svg>
          </div>
          <span data-theme-name="light">Light</span>
        </div>
      </a>
    </li>
    <li>
      <a class="text-sm py-2 px-3 font-normal block w-full whitespace-nowrap bg-transparent text-neutral-700 dark:text-neutral-100 hover:bg-neutral-100 disabled:text-neutral-400 disabled:pointer-events-none disabled:bg-transparent active:no-underline active:text-neutral-800 dark:hover:bg-neutral-600 focus:outline-none focus:bg-neutral-200 focus:dark:bg-neutral-600"
        href="#" data-theme="dark" data-te-dropdown-item-ref>
        <div class="pointer-events-none">
          <div class="inline-block w-[24px] text-center" data-theme-icon="dark">
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"
              class="inline-block w-3" role="img" viewBox="0 0 384 512">
              <path fill="currentColor"
                d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z" />
            </svg>
          </div>
          <span data-theme-name="dark">Dark</span>
        </div>
      </a>
    </li>
  </ul>
</div>
`;

/*
<li>
  <a
    class="text-sm py-2 px-3 font-normal block w-full whitespace-nowrap bg-transparent text-neutral-700 dark:text-neutral-100 hover:bg-neutral-100 disabled:text-neutral-400 disabled:pointer-events-none disabled:bg-transparent active:no-underline active:text-neutral-800 dark:hover:bg-neutral-600 focus:outline-none focus:bg-neutral-200 focus:dark:bg-neutral-600"
    href="#"
    data-theme="system"
    data-te-dropdown-item-ref
  >
    <div class="pointer-events-none">
      <div class="inline-block w-[24px] text-center" data-theme-icon="system">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
          class="inline-block w-4"
          role="img"
          viewBox="0 0 640 512"
        >
          <path
            fill="currentColor"
            d="M128 32C92.7 32 64 60.7 64 96V352h64V96H512V352h64V96c0-35.3-28.7-64-64-64H128zM19.2 384C8.6 384 0 392.6 0 403.2C0 445.6 34.4 480 76.8 480H563.2c42.4 0 76.8-34.4 76.8-76.8c0-10.6-8.6-19.2-19.2-19.2H19.2z"
          />
        </svg>
      </div>
      <span data-theme-name="system">System</span>
    </div>
  </a>
</li>;
*/
