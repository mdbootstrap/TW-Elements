'use strict';

import { DPL } from '../dynamic-parts-loader.js';

export const authModal = DPL.defineComponent({
  selector: '#dpl-auth-modal',
  template: (userData) => {
    return `<div
  data-te-modal-init
  class="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
  id="navbarLogin"
  tabindex="-1"
  aria-labelledby="exampleModalSecondLabel"
  aria-hidden="true"
>
  <div
    data-te-modal-dialog-ref
    class="pointer-events-none relative w-auto translate-y-[-50px] opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px]"
  >
    <div class="pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-4 outline-none dark:bg-neutral-700">
      <div class="relative flex-auto p-4 text-center" data-te-modal-body-ref>
        <ul
          class="mb-5 flex w-full list-none flex-col flex-wrap pl-0 md:flex-row md:justify-center"
          role="tablist"
          data-te-nav-ref
        >
          <li class="md:w-1/2" role="presentation">
            <a
              href="#pills-login"
              class="my-2 block rounded bg-zinc-100 px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 data-[te-nav-active]:!bg-primary-100 data-[te-nav-active]:text-primary-700 dark:bg-neutral-800/25 dark:text-white/50 dark:data-[te-nav-active]:!bg-slate-900 dark:data-[te-nav-active]:text-primary-500 md:mr-4"
              id="pills-login-tab"
              data-te-toggle="pill"
              data-te-target="#pills-login"
              data-te-nav-active
              role="tab"
              aria-controls="pills-login"
              aria-selected="true"
              >Login</a
            >
          </li>
          <li class="md:w-1/2" role="presentation">
            <a
              href="#pills-register"
              class="my-2 block rounded bg-zinc-100 px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 data-[te-nav-active]:!bg-primary-100 data-[te-nav-active]:text-primary-700 dark:bg-neutral-800/25 dark:text-white/50 dark:data-[te-nav-active]:!bg-slate-900 dark:data-[te-nav-active]:text-primary-500 md:mr-4"
              id="pills-register-tab"
              data-te-toggle="pill"
              data-te-target="#pills-register"
              role="tab"
              aria-controls="pills-register"
              aria-selected="false"
              >Register</a
            >
          </li>
        </ul>
        <div class="mb-6">
          <div
            class="hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
            id="pills-login"
            role="tabpanel"
            aria-labelledby="pills-login-tab"
            data-te-tab-active
          >
            <p class="mb-1">Connect with:</p>
            <div class="flex justify-center space-x-2">
              <a
                href="https://mdbootstrap.com/wp-login.php?action=wordpress_social_authenticate&mode=login&provider=Facebook&redirect_to=${encodeURIComponent(
                  location.href
                )}"
                title="Connect with Facebook"
                role="button"
                data-te-ripple-init
                data-te-ripple-color="light"
                class="inline-block rounded-full bg-primary p-3 uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
              >
                <span class="[&>svg]:h-3 [&>svg]:w-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"
                    />
                  </svg>
                </span>
              </a>
              <a
                href="https://mdbootstrap.com/wp-login.php?action=wordpress_social_authenticate&mode=login&provider=Google&redirect_to=${encodeURIComponent(
                  location.href
                )}"
                title="Connect with Google"
                role="button"
                data-te-ripple-init
                data-te-ripple-color="light"
                class="inline-block rounded-full bg-primary p-3 uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
              >
                <span class="[&>svg]:h-3 [&>svg]:w-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 488 512"
                    fill="currentColor"
                  >
                    <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                    <path
                      d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                    />
                  </svg>
                </span>
              </a>
              <a
                href="https://mdbootstrap.com/wp-login.php?action=wordpress_social_authenticate&mode=login&provider=Twitter&redirect_to=${encodeURIComponent(
                  location.href
                )}"
                title="Connect with Twitter"
                role="button"
                data-te-ripple-init
                data-te-ripple-color="light"
                class="inline-block rounded-full bg-primary p-3 uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
              >
                <span class="[&>svg]:h-3 [&>svg]:w-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
                    />
                  </svg>
                </span>
              </a>
            </div>
            <p class="my-3">or:</p>
            <form novalidate data-te-validation-init data-te-validation-active id="login" name="login-form">
              <p class="status"></p>
              <div
                class="relative mb-3"
                data-te-input-wrapper-init
                data-te-validate="input"
                data-te-validation-ruleset="isRequired"
              >
                <input
                  type="text"
                  class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                  id="username"
                  placeholder="Your e-mail or username"
                />
                <label
                  for="username"
                  class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-white dark:peer-focus:text-primary"
                  >Your e-mail or username
                </label>
              </div>
              <div
                class="relative mb-5"
                data-te-input-wrapper-init
                data-te-validate="input"
                data-te-validation-ruleset="isRequired"
              >
                <input
                  type="password"
                  class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                  id="password"
                  placeholder="Your password"
                />
                <label
                  for="password"
                  class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-white dark:peer-focus:text-primary"
                  >Your password
                </label>
              </div>
              <a href="#" class="text-primary-600 dark:text-primary-400"
                >Forgot password?</a
              >
              <button
                type="submit"
                data-te-submit-btn-ref
                data-te-ripple-init
                data-te-ripple-color="light"
                class="my-5 inline-block w-full rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
              >
                Sign in
              </button>
              <p>
                Not a member?
                <a
                  id="pills-register-tab-link"
                  href="#"
                  class="text-primary-600 dark:text-primary-400"
                  >Register</a
                >
              </p>
            </form>
          </div>
          <div
            class="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
            id="pills-register"
            role="tabpanel"
            aria-labelledby="pills-register-tab"
          >
            <p class="mb-1">Connect with:</p>
            <div class="flex justify-center space-x-2">
              <a
                href="https://mdbootstrap.com/wp-login.php?action=wordpress_social_authenticate&mode=login&provider=Facebook&redirect_to=${encodeURIComponent(
                  location.href
                )}"
                title="Connect with Facebook"
                role="button"
                data-te-ripple-init
                data-te-ripple-color="light"
                class="inline-block rounded-full bg-primary p-3 uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
              >
                <span class="[&>svg]:h-3 [&>svg]:w-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"
                    />
                  </svg>
                </span>
              </a>
              <a
                href="https://mdbootstrap.com/wp-login.php?action=wordpress_social_authenticate&mode=login&provider=Google&redirect_to=${encodeURIComponent(
                  location.href
                )}"
                title="Connect with Google"
                role="button"
                data-te-ripple-init
                data-te-ripple-color="light"
                class="inline-block rounded-full bg-primary p-3 uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
              >
                <span class="[&>svg]:h-3 [&>svg]:w-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 488 512"
                    fill="currentColor"
                  >
                    <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                    <path
                      d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                    />
                  </svg>
                </span>
              </a>
              <a
                href="https://mdbootstrap.com/wp-login.php?action=wordpress_social_authenticate&mode=login&provider=Twitter&redirect_to=${encodeURIComponent(
                  location.href
                )}"
                title="Connect with Twitter"
                role="button"
                data-te-ripple-init
                data-te-ripple-color="light"
                class="inline-block rounded-full bg-primary p-3 uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
              >
                <span class="[&>svg]:h-3 [&>svg]:w-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
                    />
                  </svg>
                </span>
              </a>
            </div>
            <p class="my-3">or:</p>
            <form novalidate data-te-validation-init data-te-validation-active id="register" name="register-form">
              <p class="status"></p>
              <div
                class="relative mb-3"
                data-te-input-wrapper-init
                data-te-validate="input"
                data-te-validation-ruleset="isRequired"
              >
                <input
                  type="text"
                  class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                  id="signonname"
                  placeholder="Your name"
                />
                <label
                  for="signonname"
                  class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-white dark:peer-focus:text-primary"
                  >Your name
                </label>
              </div>
              <div
                class="relative mb-5"
                data-te-input-wrapper-init
                data-te-validate="input"
                data-te-validation-ruleset="isRequired"
              >
                <input
                  type="text"
                  class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                  id="signonusername"
                  placeholder="Your username"
                />
                <label
                  for="signonusername"
                  class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-white dark:peer-focus:text-primary"
                  >Your username
                </label>
              </div>
              <div
                class="relative mb-5"
                data-te-input-wrapper-init
                data-te-validate="input"
                data-te-validation-ruleset="isRequired|isEmail"
              >
                <input
                  type="email"
                  class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                  id="signonemail"
                  placeholder="Your email"
                />
                <label
                  for="signonemail"
                  class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-white dark:peer-focus:text-primary"
                  >Your email
                </label>
              </div>
              <div
                class="relative mb-5"
                data-te-input-wrapper-init
                data-te-validate="input"
                data-te-validation-ruleset="isRequired"
              >
                <input
                  type="password"
                  class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                  id="signonpassword"
                  placeholder="Your password"
                />
                <label
                  for="signonpassword"
                  class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-white dark:peer-focus:text-primary"
                  >Your password
                </label>
              </div>
              <div
                class="relative mb-5"
                data-te-input-wrapper-init
                data-te-validate="input"
                data-te-validation-ruleset="isRequired"
              >
                <input
                  type="password"
                  class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                  id="password2"
                  placeholder="Repeat password"
                />
                <label
                  for="password2"
                  class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-white dark:peer-focus:text-primary"
                  >Repeat password
                </label>
                <span data-te-validation-feedback="" id="repeat-password-feedback" class="hidden absolute top-full left-0 m-1 w-auto text-sm text-[#dc4c64] animate-[fade-in_0.3s_both]">Passwords are not the same.</span>
              </div>
              <div
                class="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]"
                data-te-validate="input"
                data-te-validation-optional
              >
                <input
                  class="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-secondary-500 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-checkbox before:shadow-transparent before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-black/60 focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-black/60 focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-checkbox checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-400 dark:checked:border-primary dark:checked:bg-primary"
                  type="checkbox"
                  value=""
                  id="newsletter"
                />
                <label
                  class="inline-block pl-[0.15rem] hover:cursor-pointer"
                  for="newsletter"
                >
                  I agree to sign up for MDB account notifications and
                  newsletter
                </label>
              </div>
              <p class="px-4 text-xs text-neutral-500 dark:text-neutral-400">
                By signing up you agree to data processing by the administrator:
                StartupFlow s.c. located in Kijowska 7, Warsaw. The
                administrator processes data following the
                <a href="#" class="text-primary-600 dark:text-primary-400"
                  >Privacy Policy</a
                >.
              </p>
              <button
                type="submit"
                data-te-submit-btn-ref
                data-te-ripple-init
                data-te-ripple-color="light"
                class="mt-5 inline-block w-full rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
              >
                Sign up
              </button>
            </form>
          </div>
        </div>
      </div>
      <div
        class="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 p-4 dark:border-white/10"
      >
        <button
          type="button"
          class="ml-1 inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-200 focus:bg-primary-accent-200 focus:outline-none focus:ring-0 active:bg-primary-accent-200 dark:bg-primary-300 dark:hover:bg-primary-400 dark:focus:bg-primary-400 dark:active:bg-primary-400"
          data-te-ripple-init
          data-te-ripple-color="light"
          data-te-modal-dismiss
        >
          Close
        </button>
      </div>
    </div>
  </div>
</div>`;
  },
  mounted() {
    if (window.te !== undefined && typeof te !== 'undefined') {
      document
        .querySelectorAll('#navbarLogin [data-te-input-wrapper-init]')
        .forEach((formInput) => new te.Input(formInput).update());

      document.querySelectorAll('[data-te-toggle="pill"]').forEach((triggerEl) => {
        const tabTrigger = new te.Tab(triggerEl);

        triggerEl.addEventListener('click', (e) => {
          e.preventDefault();
          tabTrigger.show();
        });
      });
    }
  },
});
