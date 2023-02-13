export const switcherTemplate = `
<div class="fixed right-5 bottom-5 z-[9999]" id="theme-switcher">
  <button
    class="w-[30px] h-[30px] text-black dark:text-white uppercase rounded-full hover:shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:bg-gray-300 dark:focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out flex items-center justify-center whitespace-nowrap motion-reduce:transition-none"
    type="button" id="themeSwitcher" data-te-dropdown-toggle-ref aria-expanded="false">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 inline-block">
      <path fill-rule="evenodd" d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 01-.517.608 7.45 7.45 0 00-.478.198.798.798 0 01-.796-.064l-.453-.324a1.875 1.875 0 00-2.416.2l-.243.243a1.875 1.875 0 00-.2 2.416l.324.453a.798.798 0 01.064.796 7.448 7.448 0 00-.198.478.798.798 0 01-.608.517l-.55.092a1.875 1.875 0 00-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 01-.064.796l-.324.453a1.875 1.875 0 00.2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 01.796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 01.517-.608 7.52 7.52 0 00.478-.198.798.798 0 01.796.064l.453.324a1.875 1.875 0 002.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 01-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 001.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 01-.608-.517 7.507 7.507 0 00-.198-.478.798.798 0 01.064-.796l.324-.453a1.875 1.875 0 00-.2-2.416l-.243-.243a1.875 1.875 0 00-2.416-.2l-.453.324a.798.798 0 01-.796.064 7.462 7.462 0 00-.478-.198.798.798 0 01-.517-.608l-.091-.55a1.875 1.875 0 00-1.85-1.566h-.344zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clip-rule="evenodd" />
    </svg>
  </button>
  <ul
    class="min-w-max absolute bg-white text-base z-[1000] float-left py-2 list-none text-left rounded-lg shadow-lg hidden m-0 bg-clip-padding border-none [&[data-te-dropdown-show]]:block dark:bg-gray-800"
    aria-labelledby="themeSwitcher" data-te-dropdown-menu-ref>
    <li>
      <a class="text-sm py-2 px-3 font-normal block w-full whitespace-nowrap bg-transparent text-gray-700 dark:text-gray-100 hover:bg-gray-100 disabled:text-gray-400 disabled:pointer-events-none disabled:bg-transparent active:no-underline active:text-zinc-800 dark:hover:bg-gray-600 focus:outline-none focus:bg-gray-200 focus:dark:bg-gray-600"
        href="#" data-theme="light" data-te-dropdown-item-ref>
        <div class="pointer-events-none">
          <div class="inline-block w-[24px] text-center" data-theme-icon="light">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 inline-block">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>   
          </div>
          <span data-theme-name="light">Light</span>
        </div>
      </a>
    </li>
    <li>
      <a class="text-sm py-2 px-3 font-normal block w-full whitespace-nowrap bg-transparent text-gray-700 dark:text-gray-100 hover:bg-gray-100 disabled:text-gray-400 disabled:pointer-events-none disabled:bg-transparent active:no-underline active:text-zinc-800 dark:hover:bg-gray-600 focus:outline-none focus:bg-gray-200 focus:dark:bg-gray-600"
        href="#" data-theme="dark" data-te-dropdown-item-ref>
        <div class="pointer-events-none">
          <div class="inline-block w-[24px] text-center" data-theme-icon="dark">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 inline-block">
              <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd" />
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
    class="text-sm py-2 px-3 font-normal block w-full whitespace-nowrap bg-transparent text-gray-700 dark:text-gray-100 hover:bg-gray-100 disabled:text-gray-400 disabled:pointer-events-none disabled:bg-transparent active:no-underline active:text-zinc-800 dark:hover:bg-gray-600 focus:outline-none focus:bg-gray-200 focus:dark:bg-gray-600"
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
