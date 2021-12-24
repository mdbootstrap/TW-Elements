const plugin = require('tailwindcss/plugin');

module.exports = plugin(function ({ matchUtilities }) {
  matchUtilities({
    body: {
      'font-family': '"Inter", sans-serif !important',
    },
    '.form-control[type=file]': { overflow: 'hidden' },
    '.form-control[type=file]:not(:disabled):not([readonly])': {
      cursor: 'pointer',
    },
    '.form-control:focus': { boxShadow: '0 0 0 1px #2563eb' },
    '.form-control::file-selector-button': {
      padding: '0.375rem 0.75rem',
      margin: '-0.375rem -0.75rem',
      marginInlineEnd: '0.75rem',
      color: '#212529',
      backgroundColor: '#e9ecef',
      pointerEvents: 'none',
      borderColor: 'inherit',
      borderStyle: 'solid',
      borderWidth: '0',
      borderInlineEndWidth: '1px',
      borderRadius: '0',
      transition:
        'color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
    },
    '@media (prefers-reduced-motion: reduce)': [
      { '.form-control::file-selector-button': { transition: 'none' } },
      { '.form-control::-webkit-file-upload-button': { transition: 'none' } },
      { '.form-switch .form-check-input': { transition: 'none' } },
      { '.form-range::-webkit-slider-thumb': { transition: 'none' } },
      { '.form-range::-moz-range-thumb': { transition: 'none' } },
      { '.form-floating > label': { transition: 'none' } },
      { '.fade': { transition: 'none' } },
      { '.collapsing': { transition: 'none' } },
      { '.collapsing.collapse-horizontal': { transition: 'none' } },
      { '.accordion-button::after': { transition: 'none' } },
      { '.modal.fade .modal-dialog': { transition: 'none' } },
      { '.carousel-item': { transition: 'none' } },
      {
        '.carousel-fade .active.carousel-item-start,\n.carousel-fade .active.carousel-item-end': {
          transition: 'none',
        },
      },
      {
        '.carousel-control-prev,\n.carousel-control-next': { transition: 'none' },
      },
      { '.carousel-indicators [data-bs-target]': { transition: 'none' } },
      { '.spinner-border,\n.spinner-grow': { animationDuration: '1.5s' } },
    ],
    '.form-control:hover:not(:disabled):not([readonly])::file-selector-button': {
      backgroundColor: '#dde0e3',
    },
    '.form-control::-webkit-file-upload-button': {
      padding: '0.375rem 0.75rem',
      margin: '-0.375rem -0.75rem',
      marginInlineEnd: '0.75rem',
      color: '#374151',
      backgroundColor: '#f3f4f6',
      pointerEvents: 'none',
      borderColor: 'inherit',
      borderStyle: 'solid',
      borderWidth: '0',
      borderInlineEndWidth: '1px',
      borderRadius: '0',
      transition:
        'color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
    },
    '.form-control:hover:not(:disabled):not([readonly])::-webkit-file-upload-button': {
      backgroundColor: '#dde0e3',
    },
    '.form-select': {
      MozPaddingStart: 'calc(0.75rem - 3px)',
      backgroundImage:
        "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e\")",
      backgroundPosition: 'right 0.75rem center',
      backgroundSize: '16px 12px',
    },
    '.form-select:focus': { boxShadow: '0 0 0 1px #2563eb' },
    '.form-select[multiple], .form-select[size]:not([size="1"])': {
      paddingRight: '0.75rem',
      backgroundImage: 'none',
    },
    '.form-select:disabled': { backgroundColor: '#e9ecef' },
    '.form-select:-moz-focusring': {
      color: 'transparent',
      textShadow: '0 0 0 #212529',
    },
    '.form-check-input:checked': {
      backgroundColor: '#0d6efd',
      borderColor: '#0d6efd',
    },
    '.form-check-input:checked[type=checkbox]': {
      backgroundImage:
        "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10l3 3l6-6'/%3e%3c/svg%3e\")",
    },
    '.form-check-input:checked[type=radio]': {
      backgroundImage:
        "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='2' fill='%23fff'/%3e%3c/svg%3e\")",
    },
    '.form-check-input[type=checkbox]:indeterminate': {
      backgroundColor: '#0d6efd',
      borderColor: '#0d6efd',
      backgroundImage:
        "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10h8'/%3e%3c/svg%3e\")",
    },
    '.form-check-input:disabled': {
      pointerEvents: 'none',
      filter: 'none',
      opacity: 0.5,
    },
    '.form-switch': { paddingLeft: '2.5em' },
    '.form-switch .form-check-input': {
      marginTop: '0.1rem',
      backgroundImage:
        "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e\")",
      backgroundPosition: 'left center',
      transition: 'background-position 0.15s ease-in-out',
    },
    '.form-switch .form-check-input:focus': {
      backgroundImage:
        "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e\")",
    },
    '.form-switch .form-check-input:checked': {
      backgroundPosition: 'right center',
      backgroundImage:
        "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e\")",
    },
    '.form-check-inline': { display: 'inline-block', marginRight: '1rem' },
    '.btn-check': {
      position: 'absolute',
      clip: 'rect(0, 0, 0, 0)',
      pointerEvents: 'none',
    },
    '.btn-check[disabled] + .btn, .btn-check:disabled + .btn': {
      pointerEvents: 'none',
      filter: 'none',
      opacity: 0.65,
    },
    '.form-range:focus::-webkit-slider-thumb': { boxShadow: 'none' },
    '.form-range:focus::-moz-range-thumb': { boxShadow: 'none' },
    '.form-range::-moz-focus-outer': { border: '0' },
    '.form-range::-webkit-slider-thumb': {
      width: '1rem',
      height: '1rem',
      marginTop: '-0.25rem',
      backgroundColor: '#0d6efd',
      border: '0',
      borderRadius: '1rem',
      transition:
        'background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
      appearance: 'none',
      WebkitAppearance: 'none',
    },
    '.form-range::-webkit-slider-thumb:active': { backgroundColor: '#b6d4fe' },
    '.form-range::-webkit-slider-runnable-track': {
      width: '100%',
      height: '0.5rem',
      color: 'transparent',
      cursor: 'pointer',
      backgroundColor: '#dee2e6',
      borderColor: 'transparent',
      borderRadius: '1rem',
    },
    '.form-range::-moz-range-thumb': {
      width: '1rem',
      height: '1rem',
      backgroundColor: '#0d6efd',
      border: '0',
      borderRadius: '1rem',
      transition:
        'background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
      appearance: 'none',
    },
    '.form-range::-moz-range-thumb:active': { backgroundColor: '#b6d4fe' },
    '.form-range::-moz-range-track': {
      width: '100%',
      height: '0.5rem',
      color: 'transparent',
      cursor: 'pointer',
      backgroundColor: '#dee2e6',
      borderColor: 'transparent',
      borderRadius: '1rem',
    },
    '.form-range:disabled': { pointerEvents: 'none' },
    '.form-range:disabled::-webkit-slider-thumb': { backgroundColor: '#adb5bd' },
    '.form-range:disabled::-moz-range-thumb': { backgroundColor: '#adb5bd' },
    '.form-floating': { position: 'relative' },
    '.form-floating > .form-control,\n.form-floating > .form-select': {
      height: 'calc(3.5rem + 2px)',
      lineHeight: 1.25,
    },
    '.form-floating > label': {
      position: 'absolute',
      top: '0',
      left: '0',
      height: '100%',
      padding: '1rem 0.75rem',
      pointerEvents: 'none',
      border: '1px solid transparent',
      transformOrigin: '0 0',
      transition: 'opacity 0.1s ease-in-out, transform 0.1s ease-in-out',
    },
    '.form-floating > .form-control': { padding: '1rem 0.75rem' },
    '.form-floating > .form-control::placeholder': { color: 'transparent' },
    '.form-floating > .form-control:focus, .form-floating > .form-control:not(:placeholder-shown)':
      {
        paddingTop: '1.625rem',
        paddingBottom: '0.625rem',
      },
    '.form-floating > .form-control:-webkit-autofill': {
      paddingTop: '1.625rem',
      paddingBottom: '0.625rem',
    },
    '.form-floating > .form-control:focus ~ label,\n.form-floating > .form-control:not(:placeholder-shown) ~ label,\n.form-floating > .form-select ~ label':
      {
        opacity: 0.65,
        transform: 'scale(0.85) translateY(-0.5rem) translateX(0.15rem)',
      },
    '.input-group > .form-control,\n.input-group > .form-select': { width: '1%' },
    '.input-group > .form-control:focus,\n.input-group > .form-select:focus': {
      zIndex: 3,
    },
    '.input-group .btn': { position: 'relative', zIndex: 2 },
    '.input-group .btn:focus': { zIndex: 3 },
    '.input-group-lg > .form-select,\n.input-group-sm > .form-select': {
      paddingRight: '3rem',
    },
    '.input-group:not(.has-validation) > :not(:last-child):not(.dropdown-toggle):not(.dropdown-menu),\n.input-group:not(.has-validation) > .dropdown-toggle:nth-last-child(n+3)':
      {
        borderTopRightRadius: '0',
        borderBottomRightRadius: '0',
      },
    '.input-group.has-validation > :nth-last-child(n+3):not(.dropdown-toggle):not(.dropdown-menu),\n.input-group.has-validation > .dropdown-toggle:nth-last-child(n+4)':
      {
        borderTopRightRadius: '0',
        borderBottomRightRadius: '0',
      },
    '.input-group > :not(:first-child):not(.dropdown-menu):not(.valid-tooltip):not(.valid-feedback):not(.invalid-tooltip):not(.invalid-feedback)':
      {
        marginLeft: '-1px',
        borderTopLeftRadius: '0',
        borderBottomLeftRadius: '0',
      },
    '.valid-feedback': {
      display: 'none',
      width: '100%',
      marginTop: '0.25rem',
      fontSize: '0.875em',
      color: '#198754',
    },
    '.valid-tooltip': {
      position: 'absolute',
      top: '100%',
      zIndex: 5,
      display: 'none',
      maxWidth: '100%',
      padding: '0.25rem 0.5rem',
      marginTop: '0.1rem',
      fontSize: '0.875rem',
      color: '#fff',
      backgroundColor: 'rgba(25, 135, 84, 0.9)',
      borderRadius: '0.25rem',
    },
    '.was-validated :valid ~ .valid-feedback,\n.was-validated :valid ~ .valid-tooltip,\n.is-valid ~ .valid-feedback,\n.is-valid ~ .valid-tooltip':
      {
        display: 'block',
      },
    '.was-validated .form-control:valid, .form-control.is-valid': {
      borderColor: '#198754',
      paddingRight: 'calc(1.5em + 0.75rem)',
      backgroundImage:
        "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23198754' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e\")",
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right calc(0.375em + 0.1875rem) center',
      backgroundSize: 'calc(0.75em + 0.375rem) calc(0.75em + 0.375rem)',
    },
    '.was-validated .form-control:valid:focus, .form-control.is-valid:focus': {
      borderColor: '#198754',
      boxShadow: '0 0 0 0.25rem rgba(25, 135, 84, 0.25)',
    },
    '.was-validated textarea.form-control:valid, textarea.form-control.is-valid': {
      paddingRight: 'calc(1.5em + 0.75rem)',
      backgroundPosition: 'top calc(0.375em + 0.1875rem) right calc(0.375em + 0.1875rem)',
    },
    '.was-validated .form-select:valid, .form-select.is-valid': {
      borderColor: '#198754',
    },
    '.was-validated .form-select:valid:not([multiple]):not([size]), .was-validated .form-select:valid:not([multiple])[size="1"], .form-select.is-valid:not([multiple]):not([size]), .form-select.is-valid:not([multiple])[size="1"]':
      {
        paddingRight: '4.125rem',
        backgroundImage:
          "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e\"), url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23198754' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e\")",
        backgroundPosition: 'right 0.75rem center, center right 2.25rem',
        backgroundSize: '16px 12px, calc(0.75em + 0.375rem) calc(0.75em + 0.375rem)',
      },
    '.was-validated .form-select:valid:focus, .form-select.is-valid:focus': {
      borderColor: '#198754',
      boxShadow: '0 0 0 0.25rem rgba(25, 135, 84, 0.25)',
    },
    '.was-validated .form-check-input:valid, .form-check-input.is-valid': {
      borderColor: '#198754',
    },
    '.was-validated .form-check-input:valid:checked, .form-check-input.is-valid:checked': {
      backgroundColor: '#198754',
    },
    '.was-validated .form-check-input:valid:focus, .form-check-input.is-valid:focus': {
      boxShadow: '0 0 0 0.25rem rgba(25, 135, 84, 0.25)',
    },
    '.was-validated .form-check-input:valid ~ .form-check-label, .form-check-input.is-valid ~ .form-check-label':
      {
        color: '#198754',
      },
    '.form-check-inline .form-check-input ~ .valid-feedback': {
      marginLeft: '0.5em',
    },
    '.was-validated .input-group .form-control:valid, .input-group .form-control.is-valid,\n.was-validated .input-group .form-select:valid,\n.input-group .form-select.is-valid':
      {
        zIndex: 1,
      },
    '.was-validated .input-group .form-control:valid:focus, .input-group .form-control.is-valid:focus,\n.was-validated .input-group .form-select:valid:focus,\n.input-group .form-select.is-valid:focus':
      {
        zIndex: 3,
      },
    '.invalid-feedback': {
      display: 'none',
      width: '100%',
      marginTop: '0.25rem',
      fontSize: '0.875em',
      color: '#dc3545',
    },
    '.invalid-tooltip': {
      position: 'absolute',
      top: '100%',
      zIndex: 5,
      display: 'none',
      maxWidth: '100%',
      padding: '0.25rem 0.5rem',
      marginTop: '0.1rem',
      fontSize: '0.875rem',
      color: '#fff',
      backgroundColor: 'rgba(220, 53, 69, 0.9)',
      borderRadius: '0.25rem',
    },
    '.was-validated :invalid ~ .invalid-feedback,\n.was-validated :invalid ~ .invalid-tooltip,\n.is-invalid ~ .invalid-feedback,\n.is-invalid ~ .invalid-tooltip':
      {
        display: 'block',
      },
    '.was-validated .form-control:invalid, .form-control.is-invalid': {
      borderColor: '#dc3545',
      paddingRight: 'calc(1.5em + 0.75rem)',
      backgroundImage:
        "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e\")",
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right calc(0.375em + 0.1875rem) center',
      backgroundSize: 'calc(0.75em + 0.375rem) calc(0.75em + 0.375rem)',
    },
    '.was-validated .form-control:invalid:focus, .form-control.is-invalid:focus': {
      borderColor: '#dc3545',
      boxShadow: '0 0 0 0.25rem rgba(220, 53, 69, 0.25)',
    },
    '.was-validated textarea.form-control:invalid, textarea.form-control.is-invalid': {
      paddingRight: 'calc(1.5em + 0.75rem)',
      backgroundPosition: 'top calc(0.375em + 0.1875rem) right calc(0.375em + 0.1875rem)',
    },
    '.was-validated .form-select:invalid, .form-select.is-invalid': {
      borderColor: '#dc3545',
    },
    '.was-validated .form-select:invalid:not([multiple]):not([size]), .was-validated .form-select:invalid:not([multiple])[size="1"], .form-select.is-invalid:not([multiple]):not([size]), .form-select.is-invalid:not([multiple])[size="1"]':
      {
        paddingRight: '4.125rem',
        backgroundImage:
          "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e\"), url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e\")",
        backgroundPosition: 'right 0.75rem center, center right 2.25rem',
        backgroundSize: '16px 12px, calc(0.75em + 0.375rem) calc(0.75em + 0.375rem)',
      },
    '.was-validated .form-select:invalid:focus, .form-select.is-invalid:focus': {
      borderColor: '#dc3545',
      boxShadow: '0 0 0 0.25rem rgba(220, 53, 69, 0.25)',
    },
    '.was-validated .form-check-input:invalid, .form-check-input.is-invalid': {
      borderColor: '#dc3545',
    },
    '.was-validated .form-check-input:invalid:checked, .form-check-input.is-invalid:checked': {
      backgroundColor: '#dc3545',
    },
    '.was-validated .form-check-input:invalid:focus, .form-check-input.is-invalid:focus': {
      boxShadow: '0 0 0 0.25rem rgba(220, 53, 69, 0.25)',
    },
    '.was-validated .form-check-input:invalid ~ .form-check-label, .form-check-input.is-invalid ~ .form-check-label':
      {
        color: '#dc3545',
      },
    '.form-check-inline .form-check-input ~ .invalid-feedback': {
      marginLeft: '0.5em',
    },
    '.was-validated .input-group .form-control:invalid, .input-group .form-control.is-invalid,\n.was-validated .input-group .form-select:invalid,\n.input-group .form-select.is-invalid':
      {
        zIndex: 2,
      },
    '.was-validated .input-group .form-control:invalid:focus, .input-group .form-control.is-invalid:focus,\n.was-validated .input-group .form-select:invalid:focus,\n.input-group .form-select.is-invalid:focus':
      {
        zIndex: 3,
      },
    '.fade': { transition: 'opacity 0.15s linear' },
    '.fade:not(.show)': { opacity: 0 },
    '.collapse:not(.show)': { display: 'none' },
    '.collapsing': {
      height: '0',
      overflow: 'hidden',
      transition: 'height 0.35s ease',
    },
    '.collapsing.collapse-horizontal': {
      width: '0',
      height: 'auto',
      transition: 'width 0.35s ease',
    },
    '.dropdown-menu': { zIndex: 1000 },
    '.dropdown-item.active, .dropdown-item:active': {
      color: '#1f2937',
      textDecoration: 'none',
      backgroundColor: '#0d6efd',
    },
    '.dropdown-item:disabled': {
      color: '#adb5bd',
      pointerEvents: 'none',
      backgroundColor: 'transparent',
    },
    '.dropdown-menu.show': { display: 'block' },
    '.dropdown-menu-dark': {
      color: '#dee2e6',
      backgroundColor: '#343a40',
      borderColor: 'rgba(0, 0, 0, 0.15)',
    },
    '.dropdown-menu-dark .dropdown-item': { color: '#dee2e6' },
    '.dropdown-menu-dark .dropdown-item:hover, .dropdown-menu-dark .dropdown-item:focus': {
      color: '#fff',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    '.dropdown-menu-dark .dropdown-item.active, .dropdown-menu-dark .dropdown-item:active': {
      color: '#fff',
      backgroundColor: '#0d6efd',
    },
    '.dropdown-menu-dark .dropdown-item.disabled, .dropdown-menu-dark .dropdown-item:disabled': {
      color: '#adb5bd',
    },
    '.dropdown-menu-dark .dropdown-divider': {
      borderColor: 'rgba(0, 0, 0, 0.15)',
    },
    '.dropdown-menu-dark .dropdown-item-text': { color: '#dee2e6' },
    '.dropdown-menu-dark .dropdown-header': { color: '#adb5bd' },
    '.hidden-arrow.dropdown-toggle:after': { display: 'none' },
    '.nav-tabs .nav-link': { color: '#4b5563' },
    '.nav-tabs .nav-link:hover, .nav-tabs .nav-link:focus': {
      isolation: 'isolate',
    },
    '.nav-tabs .nav-link.disabled': {
      color: '#9ca3af',
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    '.nav-tabs .nav-link.active,\n.nav-tabs .nav-item.show .nav-link': {
      color: '#2563eb',
      borderColor: '#2563eb',
    },
    '.nav-tabs .dropdown-menu': {
      marginTop: '-1px',
      borderTopLeftRadius: '0',
      borderTopRightRadius: '0',
    },
    '.nav-pills .nav-link': {
      background: '#f3f4f6',
      color: '#4b5563',
      boxShadow: 'none',
    },
    '.nav-pills .nav-link.active,\n.nav-pills .show > .nav-link': {
      background: '#2563eb',
      color: '#fff',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    '.nav-pills .disabled': {
      color: '#9ca3af',
      backgroundColor: 'rgba(243, 244, 246, 0.5)',
    },
    '.nav-justified > .nav-link,\n.nav-justified .nav-item': { flexBasis: '0' },
    '.tab-content > .tab-pane': { display: 'none' },
    '.tab-content > .active': { display: 'block' },
    '.navbar-text': { paddingTop: '0.5rem', paddingBottom: '0.5rem' },
    '.navbar-collapse': { flexBasis: '100%' },
    '.navbar-nav-scroll': {
      maxHeight: 'var(--bs-scroll-height, 75vh)',
      overflowY: 'auto',
    },
    '@media (min-width: 576px)': [
      {
        '.navbar-expand-sm': { flexWrap: 'nowrap', justifyContent: 'flex-start' },
        '.navbar-expand-sm .navbar-nav': { flexDirection: 'row' },
        '.navbar-expand-sm .navbar-nav .dropdown-menu': { position: 'absolute' },
        '.navbar-expand-sm .navbar-nav .nav-link': {
          paddingRight: '0.5rem',
          paddingLeft: '0.5rem',
        },
        '.navbar-expand-sm .navbar-nav-scroll': { overflow: 'visible' },
        '.navbar-expand-sm .navbar-collapse': {
          display: 'flex !important',
          flexBasis: 'auto',
        },
        '.navbar-expand-sm .navbar-toggler': { display: 'none' },
        '.navbar-expand-sm .offcanvas-header': { display: 'none' },
        '.navbar-expand-sm .offcanvas': {
          position: 'inherit',
          bottom: '0',
          zIndex: 1000,
          flexGrow: 1,
          visibility: 'visible !important',
          backgroundColor: 'transparent',
          borderRight: '0',
          borderLeft: '0',
          transition: 'none',
          transform: 'none',
        },
        '.navbar-expand-sm .offcanvas-top,\n.navbar-expand-sm .offcanvas-bottom': {
          height: 'auto',
          borderTop: '0',
          borderBottom: '0',
        },
        '.navbar-expand-sm .offcanvas-body': {
          display: 'flex',
          flexGrow: 0,
          padding: '0',
          overflowY: 'visible',
        },
      },
      {
        '.modal-dialog': { maxWidth: '500px', margin: '1.75rem auto' },
        '.modal-dialog-scrollable': { height: 'calc(100% - 3.5rem)' },
        '.modal-dialog-centered': { minHeight: 'calc(100% - 3.5rem)' },
        '.modal-sm': { maxWidth: '300px' },
      },
      { '.sticky-sm-top': { position: 'sticky', top: '0', zIndex: 1020 } },
    ],
    '@media (min-width: 768px)': [
      {
        '.navbar-expand-md': { flexWrap: 'nowrap', justifyContent: 'flex-start' },
        '.navbar-expand-md .navbar-nav': { flexDirection: 'row' },
        '.navbar-expand-md .navbar-nav .dropdown-menu': { position: 'absolute' },
        '.navbar-expand-md .navbar-nav .nav-link': {
          paddingRight: '0.5rem',
          paddingLeft: '0.5rem',
        },
        '.navbar-expand-md .navbar-nav-scroll': { overflow: 'visible' },
        '.navbar-expand-md .navbar-collapse': {
          display: 'flex !important',
          flexBasis: 'auto',
        },
        '.navbar-expand-md .navbar-toggler': { display: 'none' },
        '.navbar-expand-md .offcanvas-header': { display: 'none' },
        '.navbar-expand-md .offcanvas': {
          position: 'inherit',
          bottom: '0',
          zIndex: 1000,
          flexGrow: 1,
          visibility: 'visible !important',
          backgroundColor: 'transparent',
          borderRight: '0',
          borderLeft: '0',
          transition: 'none',
          transform: 'none',
        },
        '.navbar-expand-md .offcanvas-top,\n.navbar-expand-md .offcanvas-bottom': {
          height: 'auto',
          borderTop: '0',
          borderBottom: '0',
        },
        '.navbar-expand-md .offcanvas-body': {
          display: 'flex',
          flexGrow: 0,
          padding: '0',
          overflowY: 'visible',
        },
      },
      { '.sticky-md-top': { position: 'sticky', top: '0', zIndex: 1020 } },
    ],
    '@media (min-width: 992px)': [
      {
        '.navbar-expand-lg': { flexWrap: 'nowrap', justifyContent: 'flex-start' },
        '.navbar-expand-lg .navbar-nav': { flexDirection: 'row' },
        '.navbar-expand-lg .navbar-nav .dropdown-menu': { position: 'absolute' },
        '.navbar-expand-lg .navbar-nav .nav-link': {
          paddingRight: '0.5rem',
          paddingLeft: '0.5rem',
        },
        '.navbar-expand-lg .navbar-nav-scroll': { overflow: 'visible' },
        '.navbar-expand-lg .navbar-collapse': {
          display: 'flex !important',
          flexBasis: 'auto',
        },
        '.navbar-expand-lg .navbar-toggler': { display: 'none' },
        '.navbar-expand-lg .offcanvas-header': { display: 'none' },
        '.navbar-expand-lg .offcanvas': {
          position: 'inherit',
          bottom: '0',
          zIndex: 1000,
          flexGrow: 1,
          visibility: 'visible !important',
          backgroundColor: 'transparent',
          borderRight: '0',
          borderLeft: '0',
          transition: 'none',
          transform: 'none',
        },
        '.navbar-expand-lg .offcanvas-top,\n.navbar-expand-lg .offcanvas-bottom': {
          height: 'auto',
          borderTop: '0',
          borderBottom: '0',
        },
        '.navbar-expand-lg .offcanvas-body': {
          display: 'flex',
          flexGrow: 0,
          padding: '0',
          overflowY: 'visible',
        },
      },
      { '.modal-lg,\n.modal-xl': { maxWidth: '800px' } },
      { '.sticky-lg-top': { position: 'sticky', top: '0', zIndex: 1020 } },
    ],
    '@media (min-width: 1200px)': [
      {
        '.navbar-expand-xl': { flexWrap: 'nowrap', justifyContent: 'flex-start' },
        '.navbar-expand-xl .navbar-nav': { flexDirection: 'row' },
        '.navbar-expand-xl .navbar-nav .dropdown-menu': { position: 'absolute' },
        '.navbar-expand-xl .navbar-nav .nav-link': {
          paddingRight: '0.5rem',
          paddingLeft: '0.5rem',
        },
        '.navbar-expand-xl .navbar-nav-scroll': { overflow: 'visible' },
        '.navbar-expand-xl .navbar-collapse': {
          display: 'flex !important',
          flexBasis: 'auto',
        },
        '.navbar-expand-xl .navbar-toggler': { display: 'none' },
        '.navbar-expand-xl .offcanvas-header': { display: 'none' },
        '.navbar-expand-xl .offcanvas': {
          position: 'inherit',
          bottom: '0',
          zIndex: 1000,
          flexGrow: 1,
          visibility: 'visible !important',
          backgroundColor: 'transparent',
          borderRight: '0',
          borderLeft: '0',
          transition: 'none',
          transform: 'none',
        },
        '.navbar-expand-xl .offcanvas-top,\n.navbar-expand-xl .offcanvas-bottom': {
          height: 'auto',
          borderTop: '0',
          borderBottom: '0',
        },
        '.navbar-expand-xl .offcanvas-body': {
          display: 'flex',
          flexGrow: 0,
          padding: '0',
          overflowY: 'visible',
        },
      },
      { '.modal-xl': { maxWidth: '1140px' } },
      { '.sticky-xl-top': { position: 'sticky', top: '0', zIndex: 1020 } },
    ],
    '@media (min-width: 1400px)': [
      {
        '.navbar-expand-xxl': {
          flexWrap: 'nowrap',
          justifyContent: 'flex-start',
        },
        '.navbar-expand-xxl .navbar-nav': { flexDirection: 'row' },
        '.navbar-expand-xxl .navbar-nav .dropdown-menu': { position: 'absolute' },
        '.navbar-expand-xxl .navbar-nav .nav-link': {
          paddingRight: '0.5rem',
          paddingLeft: '0.5rem',
        },
        '.navbar-expand-xxl .navbar-nav-scroll': { overflow: 'visible' },
        '.navbar-expand-xxl .navbar-collapse': {
          display: 'flex !important',
          flexBasis: 'auto',
        },
        '.navbar-expand-xxl .navbar-toggler': { display: 'none' },
        '.navbar-expand-xxl .offcanvas-header': { display: 'none' },
        '.navbar-expand-xxl .offcanvas': {
          position: 'inherit',
          bottom: '0',
          zIndex: 1000,
          flexGrow: 1,
          visibility: 'visible !important',
          backgroundColor: 'transparent',
          borderRight: '0',
          borderLeft: '0',
          transition: 'none',
          transform: 'none',
        },
        '.navbar-expand-xxl .offcanvas-top,\n.navbar-expand-xxl .offcanvas-bottom': {
          height: 'auto',
          borderTop: '0',
          borderBottom: '0',
        },
        '.navbar-expand-xxl .offcanvas-body': {
          display: 'flex',
          flexGrow: 0,
          padding: '0',
          overflowY: 'visible',
        },
      },
      { '.sticky-xxl-top': { position: 'sticky', top: '0', zIndex: 1020 } },
    ],
    '.navbar-expand': { flexWrap: 'nowrap', justifyContent: 'flex-start' },
    '.navbar-expand .navbar-nav': { flexDirection: 'row' },
    '.navbar-expand .navbar-nav .dropdown-menu': { position: 'absolute' },
    '.navbar-expand .navbar-nav .nav-link': {
      paddingRight: '0.5rem',
      paddingLeft: '0.5rem',
    },
    '.navbar-expand .navbar-nav-scroll': { overflow: 'visible' },
    '.navbar-expand .navbar-collapse': {
      display: 'flex !important',
      flexBasis: 'auto',
    },
    '.navbar-expand .navbar-toggler': { display: 'none' },
    '.navbar-expand .offcanvas-header': { display: 'none' },
    '.navbar-expand .offcanvas': {
      position: 'inherit',
      bottom: '0',
      zIndex: 1000,
      flexGrow: 1,
      visibility: 'visible !important',
      backgroundColor: 'transparent',
      borderRight: '0',
      borderLeft: '0',
      transition: 'none',
      transform: 'none',
    },
    '.navbar-expand .offcanvas-top,\n.navbar-expand .offcanvas-bottom': {
      height: 'auto',
      borderTop: '0',
      borderBottom: '0',
    },
    '.navbar-expand .offcanvas-body': {
      display: 'flex',
      flexGrow: 0,
      padding: '0',
      overflowY: 'visible',
    },
    '.navbar-light .navbar-nav .nav-link.disabled': {
      color: 'rgba(0, 0, 0, 0.3)',
    },
    '.navbar-light .navbar-nav .show > .nav-link,\n.navbar-light .navbar-nav .nav-link.active': {
      color: 'rgba(0, 0, 0, 0.9)',
    },
    '.navbar-light .navbar-text': { color: 'rgba(0, 0, 0, 0.55)' },
    '.navbar-light .navbar-text a,\n.navbar-light .navbar-text a:hover,\n.navbar-light .navbar-text a:focus':
      {
        color: 'rgba(0, 0, 0, 0.9)',
      },
    '.navbar-dark .navbar-brand': { color: '#fff' },
    '.navbar-dark .navbar-brand:hover, .navbar-dark .navbar-brand:focus': {
      color: '#fff',
    },
    '.navbar-dark .navbar-nav .nav-link': { color: 'rgba(255, 255, 255, 0.55)' },
    '.navbar-dark .navbar-nav .nav-link:hover, .navbar-dark .navbar-nav .nav-link:focus': {
      color: 'rgba(255, 255, 255, 0.75)',
    },
    '.navbar-dark .navbar-nav .nav-link.disabled': {
      color: 'rgba(255, 255, 255, 0.25)',
    },
    '.navbar-dark .navbar-nav .show > .nav-link,\n.navbar-dark .navbar-nav .nav-link.active': {
      color: '#fff',
    },
    '.navbar-dark .navbar-toggler': {
      color: 'rgba(255, 255, 255, 0.55)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    '.navbar-dark .navbar-toggler-icon': {
      backgroundImage:
        "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.55%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e\")",
    },
    '.navbar-dark .navbar-text': { color: 'rgba(255, 255, 255, 0.55)' },
    '.navbar-dark .navbar-text a,\n.navbar-dark .navbar-text a:hover,\n.navbar-dark .navbar-text a:focus':
      {
        color: '#fff',
      },
    '.accordion-button': { overflowAnchor: 'none' },
    '.accordion-button:not(.collapsed)': {
      color: '#2563eb',
      backgroundColor: '#fff',
      boxShadow: 'inset 0 -1px 0 #e5e7eb',
    },
    '.accordion-button:not(.collapsed)::after': {
      backgroundImage:
        "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%232563eb'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e\")",
      transform: 'rotate(-180deg)',
    },
    '.accordion-button::after': {
      flexShrink: 0,
      width: '1.25rem',
      height: '1.25rem',
      marginLeft: 'auto',
      content: '""',
      backgroundImage:
        "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23212529'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e\")",
      backgroundRepeat: 'no-repeat',
      backgroundSize: '1.25rem',
      transition: 'transform 0.2s ease-in-out',
    },
    '.accordion-button:hover': { zIndex: 2 },
    '.accordion-button:focus': { zIndex: 3 },
    '.accordion-item:first-of-type': {
      borderTopLeftRadius: '0.5rem',
      borderTopRightRadius: '0.5rem',
    },
    '.accordion-item:first-of-type .accordion-button': {
      borderTopLeftRadius: 'calc(0.5rem - 1px)',
      borderTopRightRadius: 'calc(0.5rem - 1px)',
    },
    '.accordion-item:not(:first-of-type)': { borderTop: '0' },
    '.accordion-item:last-of-type': {
      borderBottomRightRadius: '0.5rem',
      borderBottomLeftRadius: '0.5rem',
    },
    '.accordion-item:last-of-type .accordion-button.collapsed': {
      borderBottomRightRadius: 'calc(0.5rem - 1px)',
      borderBottomLeftRadius: 'calc(0.5rem - 1px)',
    },
    '.accordion-item:last-of-type .accordion-collapse': {
      borderBottomRightRadius: '0.5rem',
      borderBottomLeftRadius: '0.5rem',
    },
    '.btn-close': {
      background:
        "transparent url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e\") center/1em auto no-repeat",
    },
    '.btn-close:focus': { opacity: 1 },
    '.btn-close:disabled, .btn-close.disabled': {
      pointerEvents: 'none',
      userSelect: 'none',
      opacity: 0.25,
    },
    '.btn-close-white': { filter: 'invert(1) grayscale(100%) brightness(200%)' },
    '.modal': { zIndex: 1055 },
    '.modal-dialog': { margin: '0.5rem' },
    '.modal.fade .modal-dialog': {
      transition: 'transform 0.3s ease-out',
      transform: 'translate(0, -50px)',
    },
    '.modal.show .modal-dialog': { transform: 'none' },
    '.modal.modal-static .modal-dialog': { transform: 'scale(1.02)' },
    '.modal-dialog-scrollable': { height: 'calc(100% - 1rem)' },
    '.modal-dialog-scrollable .modal-content': {
      maxHeight: '100%',
      overflow: 'hidden',
    },
    '.modal-dialog-scrollable .modal-body': { overflowY: 'auto' },
    '.modal-dialog-centered': {
      display: 'flex',
      alignItems: 'center',
      minHeight: 'calc(100% - 1rem)',
    },
    '.modal-backdrop': {
      position: 'fixed',
      top: '0',
      left: '0',
      zIndex: 1050,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000',
    },
    '.modal-backdrop.fade': { opacity: 0 },
    '.modal-backdrop.show': { opacity: 0.5 },
    '.modal-header .btn-close': {
      padding: '0.5rem 0.5rem',
      margin: '-0.5rem -0.5rem -0.5rem auto',
    },
    '.modal-body': { flex: '1 1 auto' },
    '.modal-fullscreen': {
      width: '100vw',
      maxWidth: 'none',
      height: '100%',
      margin: '0',
    },
    '.modal-fullscreen .modal-content': {
      height: '100%',
      border: '0',
      borderRadius: '0',
    },
    '.modal-fullscreen .modal-header': { borderRadius: '0' },
    '.modal-fullscreen .modal-body': { overflowY: 'auto' },
    '.modal-fullscreen .modal-footer': { borderRadius: '0' },
    '@media (max-width: 575.98px)': {
      '.modal-fullscreen-sm-down': {
        width: '100vw',
        maxWidth: 'none',
        height: '100%',
        margin: '0',
      },
      '.modal-fullscreen-sm-down .modal-content': {
        height: '100%',
        border: '0',
        borderRadius: '0',
      },
      '.modal-fullscreen-sm-down .modal-header': { borderRadius: '0' },
      '.modal-fullscreen-sm-down .modal-body': { overflowY: 'auto' },
      '.modal-fullscreen-sm-down .modal-footer': { borderRadius: '0' },
    },
    '@media (max-width: 767.98px)': {
      '.modal-fullscreen-md-down': {
        width: '100vw',
        maxWidth: 'none',
        height: '100%',
        margin: '0',
      },
      '.modal-fullscreen-md-down .modal-content': {
        height: '100%',
        border: '0',
        borderRadius: '0',
      },
      '.modal-fullscreen-md-down .modal-header': { borderRadius: '0' },
      '.modal-fullscreen-md-down .modal-body': { overflowY: 'auto' },
      '.modal-fullscreen-md-down .modal-footer': { borderRadius: '0' },
    },
    '@media (max-width: 991.98px)': {
      '.modal-fullscreen-lg-down': {
        width: '100vw',
        maxWidth: 'none',
        height: '100%',
        margin: '0',
      },
      '.modal-fullscreen-lg-down .modal-content': {
        height: '100%',
        border: '0',
        borderRadius: '0',
      },
      '.modal-fullscreen-lg-down .modal-header': { borderRadius: '0' },
      '.modal-fullscreen-lg-down .modal-body': { overflowY: 'auto' },
      '.modal-fullscreen-lg-down .modal-footer': { borderRadius: '0' },
    },
    '@media (max-width: 1199.98px)': {
      '.modal-fullscreen-xl-down': {
        width: '100vw',
        maxWidth: 'none',
        height: '100%',
        margin: '0',
      },
      '.modal-fullscreen-xl-down .modal-content': {
        height: '100%',
        border: '0',
        borderRadius: '0',
      },
      '.modal-fullscreen-xl-down .modal-header': { borderRadius: '0' },
      '.modal-fullscreen-xl-down .modal-body': { overflowY: 'auto' },
      '.modal-fullscreen-xl-down .modal-footer': { borderRadius: '0' },
    },
    '@media (max-width: 1399.98px)': {
      '.modal-fullscreen-xxl-down': {
        width: '100vw',
        maxWidth: 'none',
        height: '100%',
        margin: '0',
      },
      '.modal-fullscreen-xxl-down .modal-content': {
        height: '100%',
        border: '0',
        borderRadius: '0',
      },
      '.modal-fullscreen-xxl-down .modal-header': { borderRadius: '0' },
      '.modal-fullscreen-xxl-down .modal-body': { overflowY: 'auto' },
      '.modal-fullscreen-xxl-down .modal-footer': { borderRadius: '0' },
    },
    '.tooltip': {
      position: 'absolute',
      zIndex: 1080,
      display: 'block',
      margin: '0',
      fontFamily: '"Inter", sans-serif',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: 1.5,
      textAlign: ['left', 'start'],
      textDecoration: 'none',
      textShadow: 'none',
      textTransform: 'none',
      letterSpacing: 'normal',
      wordBreak: 'normal',
      wordSpacing: 'normal',
      whiteSpace: 'normal',
      lineBreak: 'auto',
      fontSize: '0.875rem',
      wordWrap: 'break-word',
      opacity: 0,
    },
    '.tooltip.show': { opacity: 1 },
    '.bs-tooltip-top, .bs-tooltip-auto[data-popper-placement^=top]': {
      padding: '0.4rem 0',
    },
    '.bs-tooltip-top .tooltip-arrow, .bs-tooltip-auto[data-popper-placement^=top] .tooltip-arrow': {
      bottom: '0',
    },
    '.bs-tooltip-top .tooltip-arrow::before, .bs-tooltip-auto[data-popper-placement^=top] .tooltip-arrow::before':
      {
        top: '-1px',
        borderWidth: '0.4rem 0.4rem 0',
        borderTopColor: '#000',
      },
    '.bs-tooltip-end, .bs-tooltip-auto[data-popper-placement^=right]': {
      padding: '0 0.4rem',
    },
    '.bs-tooltip-end .tooltip-arrow, .bs-tooltip-auto[data-popper-placement^=right] .tooltip-arrow':
      {
        left: '0',
        width: '0.4rem',
        height: '0.8rem',
      },
    '.bs-tooltip-end .tooltip-arrow::before, .bs-tooltip-auto[data-popper-placement^=right] .tooltip-arrow::before':
      {
        right: '-1px',
        borderWidth: '0.4rem 0.4rem 0.4rem 0',
        borderRightColor: '#000',
      },
    '.bs-tooltip-bottom, .bs-tooltip-auto[data-popper-placement^=bottom]': {
      padding: '0.4rem 0',
    },
    '.bs-tooltip-bottom .tooltip-arrow, .bs-tooltip-auto[data-popper-placement^=bottom] .tooltip-arrow':
      {
        top: '0',
      },
    '.bs-tooltip-bottom .tooltip-arrow::before, .bs-tooltip-auto[data-popper-placement^=bottom] .tooltip-arrow::before':
      {
        bottom: '-1px',
        borderWidth: '0 0.4rem 0.4rem',
        borderBottomColor: '#000',
      },
    '.bs-tooltip-start, .bs-tooltip-auto[data-popper-placement^=left]': {
      padding: '0 0.4rem',
    },
    '.bs-tooltip-start .tooltip-arrow, .bs-tooltip-auto[data-popper-placement^=left] .tooltip-arrow':
      {
        right: '0',
        width: '0.4rem',
        height: '0.8rem',
      },
    '.bs-tooltip-start .tooltip-arrow::before, .bs-tooltip-auto[data-popper-placement^=left] .tooltip-arrow::before':
      {
        left: '-1px',
        borderWidth: '0.4rem 0 0.4rem 0.4rem',
        borderLeftColor: '#000',
      },
    '.tooltip-inner': {
      maxWidth: '200px',
      fontSize: '14px',
      padding: '6px 16px',
      color: '#fff',
      textAlign: 'center',
      backgroundColor: '#6d6d6d',
      borderRadius: '0.25rem',
    },
    '.popover': {
      position: 'absolute',
      top: '0',
      left: '0 ',
      zIndex: 1070,
      display: 'block',
      maxWidth: '276px',
      fontFamily: '"Inter", sans-serif',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: 1.5,
      textAlign: ['left', 'start'],
      textDecoration: 'none',
      textShadow: 'none',
      textTransform: 'none',
      letterSpacing: 'normal',
      wordBreak: 'normal',
      wordSpacing: 'normal',
      whiteSpace: 'normal',
      lineBreak: 'auto',
      fontSize: '0.875rem',
      wordWrap: 'break-word',
      backgroundColor: '#fff',
      backgroundClip: 'padding-box',
      border: '0',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    '.bs-popover-top > .popover-arrow, .bs-popover-auto[data-popper-placement^=top] > .popover-arrow':
      {
        bottom: 'calc(-0.5rem - 1px)',
      },
    '.bs-popover-top > .popover-arrow::before, .bs-popover-auto[data-popper-placement^=top] > .popover-arrow::before':
      {
        bottom: '0',
        borderWidth: '0.5rem 0.5rem 0',
        borderTopColor: 'rgba(0, 0, 0, 0.25)',
      },
    '.bs-popover-top > .popover-arrow::after, .bs-popover-auto[data-popper-placement^=top] > .popover-arrow::after':
      {
        bottom: '1px',
        borderWidth: '0.5rem 0.5rem 0',
        borderTopColor: '#fff',
      },
    '.bs-popover-end > .popover-arrow, .bs-popover-auto[data-popper-placement^=right] > .popover-arrow':
      {
        left: 'calc(-0.5rem - 1px)',
        width: '0.5rem',
        height: '1rem',
      },
    '.bs-popover-end > .popover-arrow::before, .bs-popover-auto[data-popper-placement^=right] > .popover-arrow::before':
      {
        left: '0',
        borderWidth: '0.5rem 0.5rem 0.5rem 0',
        borderRightColor: 'rgba(0, 0, 0, 0.25)',
      },
    '.bs-popover-end > .popover-arrow::after, .bs-popover-auto[data-popper-placement^=right] > .popover-arrow::after':
      {
        left: '1px',
        borderWidth: '0.5rem 0.5rem 0.5rem 0',
        borderRightColor: '#fff',
      },
    '.bs-popover-bottom > .popover-arrow, .bs-popover-auto[data-popper-placement^=bottom] > .popover-arrow':
      {
        top: 'calc(-0.5rem - 1px)',
      },
    '.bs-popover-bottom > .popover-arrow::before, .bs-popover-auto[data-popper-placement^=bottom] > .popover-arrow::before':
      {
        top: '0',
        borderWidth: '0 0.5rem 0.5rem 0.5rem',
        borderBottomColor: 'rgba(0, 0, 0, 0.25)',
      },
    '.bs-popover-bottom > .popover-arrow::after, .bs-popover-auto[data-popper-placement^=bottom] > .popover-arrow::after':
      {
        top: '1px',
        borderWidth: '0 0.5rem 0.5rem 0.5rem',
        borderBottomColor: '#fff',
      },
    '.bs-popover-bottom .popover-header::before, .bs-popover-auto[data-popper-placement^=bottom] .popover-header::before':
      {
        position: 'absolute',
        top: '0',
        left: '50%',
        display: 'block',
        width: '1rem',
        marginLeft: '-0.5rem',
        content: '""',
        borderBottom: '1px solid #f0f0f0',
      },
    '.bs-popover-start > .popover-arrow, .bs-popover-auto[data-popper-placement^=left] > .popover-arrow':
      {
        right: 'calc(-0.5rem - 1px)',
        width: '0.5rem',
        height: '1rem',
      },
    '.bs-popover-start > .popover-arrow::before, .bs-popover-auto[data-popper-placement^=left] > .popover-arrow::before':
      {
        right: '0',
        borderWidth: '0.5rem 0 0.5rem 0.5rem',
        borderLeftColor: 'rgba(0, 0, 0, 0.25)',
      },
    '.bs-popover-start > .popover-arrow::after, .bs-popover-auto[data-popper-placement^=left] > .popover-arrow::after':
      {
        right: '1px',
        borderWidth: '0.5rem 0 0.5rem 0.5rem',
        borderLeftColor: '#fff',
      },
    '.popover-header': {
      padding: '0.5rem 1rem',
      marginBottom: '0',
      fontSize: '1rem',
      backgroundColor: '#fff',
      borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
      borderTopLeftRadius: '0.5rem',
      borderTopRightRadius: '0.5rem',
      fontWeight: 500,
    },
    '.popover-header:empty': { display: 'none' },
    '.popover-body': { padding: '1rem 1rem', color: '#212529' },
    '.carousel.pointer-event': { touchAction: 'pan-y' },
    '.carousel-inner::after': { display: 'block', clear: 'both', content: '""' },
    '.carousel-item': {
      display: 'none',
      marginRight: '-100%',
      backfaceVisibility: 'hidden',
      transition: 'transform 0.6s ease-in-out',
    },
    '.carousel-item.active,\n.carousel-item-next,\n.carousel-item-prev': {
      display: 'block',
    },
    '.carousel-item-next:not(.carousel-item-start),\n.active.carousel-item-end': {
      transform: 'translateX(100%)',
    },
    '.carousel-item-prev:not(.carousel-item-end),\n.active.carousel-item-start': {
      transform: 'translateX(-100%)',
    },
    '.carousel-fade .carousel-item': {
      opacity: 0,
      transitionProperty: 'opacity',
      transform: 'none',
    },
    '.carousel-fade .carousel-item.active,\n.carousel-fade .carousel-item-next.carousel-item-start,\n.carousel-fade .carousel-item-prev.carousel-item-end':
      {
        zIndex: 1,
        opacity: 1,
      },
    '.carousel-fade .active.carousel-item-start,\n.carousel-fade .active.carousel-item-end': {
      zIndex: 0,
      opacity: 0,
      transition: 'opacity 0s 0.6s',
    },
    '.carousel-control-prev,\n.carousel-control-next': {
      zIndex: 1,
      width: '15%',
      color: '#fff',
      background: 'none',
      opacity: 0.5,
      transition: 'opacity 0.15s ease',
    },
    '.carousel-control-prev:hover, .carousel-control-prev:focus,\n.carousel-control-next:hover,\n.carousel-control-next:focus':
      {
        color: '#fff',
        opacity: 0.9,
      },
    '.carousel-control-prev-icon,\n.carousel-control-next-icon': {
      width: '2rem',
      height: '2rem',
      backgroundPosition: '50%',
      backgroundSize: '100% 100%',
    },
    '.carousel-control-prev-icon': {
      backgroundImage:
        "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23fff'%3e%3cpath d='M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z'/%3e%3c/svg%3e\")",
    },
    '.carousel-control-next-icon': {
      backgroundImage:
        "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23fff'%3e%3cpath d='M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e\")",
    },
    '.carousel-indicators': {
      zIndex: 2,
      marginRight: '15%',
      marginLeft: '15%',
      listStyle: 'none',
    },
    '.carousel-indicators [data-bs-target]': {
      boxSizing: 'content-box',
      flex: '0 1 auto',
      width: '30px',
      height: '3px',
      padding: '0',
      marginRight: '3px',
      marginLeft: '3px',
      textIndent: '-999px',
      cursor: 'pointer',
      backgroundColor: '#fff',
      backgroundClip: 'padding-box',
      border: '0',
      borderTop: '10px solid transparent',
      borderBottom: '10px solid transparent',
      opacity: 0.5,
      transition: 'opacity 0.6s ease',
    },
    '.carousel-indicators .active': { opacity: 1 },
    '.carousel-caption': {
      right: '15%',
      bottom: '1.25rem',
      left: '15%',
      paddingTop: '1.25rem',
      paddingBottom: '1.25rem',
      color: '#fff',
    },
    '.carousel-dark .carousel-control-prev-icon,\n.carousel-dark .carousel-control-next-icon': {
      filter: 'invert(1) grayscale(100)',
    },
    '.carousel-dark .carousel-indicators [data-bs-target]': {
      backgroundColor: '#000',
    },
    '.carousel-dark .carousel-caption': { color: '#000' },
    '.spinner-border': {
      verticalAlign: '-0.125em',
      border: '0.25em solid currentColor',
      borderRightColor: 'transparent',
    },
    '@keyframes spinner-grow': {
      '0%': { transform: 'scale(0)' },
      '50%': { opacity: 1, transform: 'none' },
    },
    '.spinner-grow': {
      verticalAlign: '-0.125em',
      animation: '0.75s linear infinite spinner-grow',
    },
    '.offcanvas': { zIndex: 1045 },
    '.offcanvas-backdrop': {
      position: 'fixed',
      top: '0',
      left: '0',
      zIndex: 1040,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000',
    },
    '.offcanvas-backdrop.fade': { opacity: 0 },
    '.offcanvas-backdrop.show': { opacity: 0.5 },
    '.offcanvas-start': { transform: 'translateX(-100%)' },
    '.offcanvas-end': { transform: 'translateX(100%)' },
    '.offcanvas-top': { transform: 'translateY(-100%)' },
    '.offcanvas-bottom': { transform: 'translateY(100%)' },
    '.offcanvas.show': { transform: 'none' },
    '.clearfix::after': { display: 'block', clear: 'both', content: '""' },
    '.link-primary': { color: '#0d6efd' },
    '.link-primary:hover, .link-primary:focus': { color: '#0a58ca' },
    '.link-secondary': { color: '#6c757d' },
    '.link-secondary:hover, .link-secondary:focus': { color: '#565e64' },
    '.link-success': { color: '#198754' },
    '.link-success:hover, .link-success:focus': { color: '#146c43' },
    '.link-info': { color: '#0dcaf0' },
    '.link-info:hover, .link-info:focus': { color: '#3dd5f3' },
    '.link-warning': { color: '#ffc107' },
    '.link-warning:hover, .link-warning:focus': { color: '#ffcd39' },
    '.link-danger': { color: '#dc3545' },
    '.link-danger:hover, .link-danger:focus': { color: '#b02a37' },
    '.link-light': { color: '#f8f9fa' },
    '.link-light:hover, .link-light:focus': { color: '#f9fafb' },
    '.link-dark': { color: '#212529' },
    '.link-dark:hover, .link-dark:focus': { color: '#1a1e21' },
    '.ratio': { position: 'relative', width: '100%' },
    '.ratio::before': {
      display: 'block',
      paddingTop: 'var(--bs-aspect-ratio)',
      content: '""',
    },
    '.ratio > *': {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
    },
    '.ratio-1x1': { '--bs-aspect-ratio': '100%' },
    '.ratio-4x3': { '--bs-aspect-ratio': '75%' },
    '.ratio-16x9': { '--bs-aspect-ratio': '56.25%' },
    '.ratio-21x9': { '--bs-aspect-ratio': '42.8571428571%' },
    '.fixed-top': {
      position: 'fixed',
      top: '0',
      right: '0',
      left: '0',
      zIndex: 1030,
    },
    '.fixed-bottom': {
      position: 'fixed',
      right: '0',
      bottom: '0',
      left: '0',
      zIndex: 1030,
    },
    '.sticky-top': { position: 'sticky', top: '0', zIndex: 1020 },
    '.hstack': {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'stretch',
    },
    '.vstack': {
      display: 'flex',
      flex: '1 1 auto',
      flexDirection: 'column',
      alignSelf: 'stretch',
    },
    '.visually-hidden,\n.visually-hidden-focusable:not(:focus):not(:focus-within)': {
      position: 'absolute !important',
      width: '1px !important',
      height: '1px !important',
      padding: '0 !important',
      margin: '-1px !important',
      overflow: 'hidden !important',
      clip: 'rect(0, 0, 0, 0) !important',
      whiteSpace: 'nowrap !important',
      border: '0 !important',
    },
    '.stretched-link::after': {
      position: 'absolute',
      top: '0',
      right: '0',
      bottom: '0',
      left: '0',
      zIndex: 1,
      content: '""',
    },
    '.text-truncate': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    '.vr': {
      display: 'inline-block',
      alignSelf: 'stretch',
      width: '1px',
      minHeight: '1em',
      backgroundColor: 'currentColor',
      opacity: 0.25,
    },
    '.ripple-surface': {
      position: 'relative',
      overflow: 'hidden',
      display: 'inline-block',
      verticalAlign: 'bottom',
    },
    '.ripple-surface-unbound': { overflow: 'visible' },
    '.ripple-wave': {
      backgroundImage:
        'radial-gradient(\n    circle,\n    rgba(0, 0, 0, 0.2) 0,\n    rgba(0, 0, 0, 0.3) 40%,\n    rgba(0, 0, 0, 0.4) 50%,\n    rgba(0, 0, 0, 0.5) 60%,\n    transparent 70%\n  )',
      borderRadius: '50%',
      opacity: 0.5,
      pointerEvents: 'none',
      position: 'absolute',
      touchAction: 'none',
      transform: 'scale(0)',
      transitionProperty: 'transform, opacity',
      transitionTimingFunction: 'cubic-bezier(0, 0, 0.15, 1), cubic-bezier(0, 0, 0.15, 1)',
      zIndex: 999,
    },
    '.ripple-wave.active': { transform: 'scale(1)', opacity: 0 },
    '.btn .ripple-wave': {
      backgroundImage:
        'radial-gradient(\n    circle,\n    hsla(0, 0%, 100%, 0.2) 0,\n    hsla(0, 0%, 100%, 0.3) 40%,\n    hsla(0, 0%, 100%, 0.4) 50%,\n    hsla(0, 0%, 100%, 0.5) 60%,\n    hsla(0, 0%, 100%, 0) 70%\n  )',
    },
    '.ripple-surface-primary .ripple-wave': {
      backgroundImage:
        'radial-gradient(\n    circle,\n    rgba(18, 102, 241, 0.2) 0,\n    rgba(18, 102, 241, 0.3) 40%,\n    rgba(18, 102, 241, 0.4) 50%,\n    rgba(18, 102, 241, 0.5) 60%,\n    rgba(18, 102, 241, 0) 70%\n  )',
    },
    '.ripple-surface-secondary .ripple-wave': {
      backgroundImage:
        'radial-gradient(\n    circle,\n    rgba(178, 60, 253, 0.2) 0,\n    rgba(178, 60, 253, 0.3) 40%,\n    rgba(178, 60, 253, 0.4) 50%,\n    rgba(178, 60, 253, 0.5) 60%,\n    rgba(178, 60, 253, 0) 70%\n  )',
    },
    '.ripple-surface-success .ripple-wave': {
      backgroundImage:
        'radial-gradient(\n    circle,\n    rgba(0, 183, 74, 0.2) 0,\n    rgba(0, 183, 74, 0.3) 40%,\n    rgba(0, 183, 74, 0.4) 50%,\n    rgba(0, 183, 74, 0.5) 60%,\n    rgba(0, 183, 74, 0) 70%\n  )',
    },
    '.ripple-surface-info .ripple-wave': {
      backgroundImage:
        'radial-gradient(\n    circle,\n    rgba(57, 192, 237, 0.2) 0,\n    rgba(57, 192, 237, 0.3) 40%,\n    rgba(57, 192, 237, 0.4) 50%,\n    rgba(57, 192, 237, 0.5) 60%,\n    rgba(57, 192, 237, 0) 70%\n  )',
    },
    '.ripple-surface-warning .ripple-wave': {
      backgroundImage:
        'radial-gradient(\n    circle,\n    rgba(255, 169, 0, 0.2) 0,\n    rgba(255, 169, 0, 0.3) 40%,\n    rgba(255, 169, 0, 0.4) 50%,\n    rgba(255, 169, 0, 0.5) 60%,\n    rgba(255, 169, 0, 0) 70%\n  )',
    },
    '.ripple-surface-danger .ripple-wave': {
      backgroundImage:
        'radial-gradient(\n    circle,\n    rgba(249, 49, 84, 0.2) 0,\n    rgba(249, 49, 84, 0.3) 40%,\n    rgba(249, 49, 84, 0.4) 50%,\n    rgba(249, 49, 84, 0.5) 60%,\n    rgba(249, 49, 84, 0) 70%\n  )',
    },
    '.ripple-surface-light .ripple-wave': {
      backgroundImage:
        'radial-gradient(\n    circle,\n    hsla(0, 0%, 98.4%, 0.2) 0,\n    hsla(0, 0%, 98.4%, 0.3) 40%,\n    hsla(0, 0%, 98.4%, 0.4) 50%,\n    hsla(0, 0%, 98.4%, 0.5) 60%,\n    hsla(0, 0%, 98.4%, 0) 70%\n  )',
    },
    '.ripple-surface-dark .ripple-wave': {
      backgroundImage:
        'radial-gradient(\n    circle,\n    rgba(38, 38, 38, 0.2) 0,\n    rgba(38, 38, 38, 0.3) 40%,\n    rgba(38, 38, 38, 0.4) 50%,\n    rgba(38, 38, 38, 0.5) 60%,\n    rgba(38, 38, 38, 0) 70%\n  )',
    },
    '.ripple-surface-white .ripple-wave': {
      backgroundImage:
        'radial-gradient(\n    circle,\n    hsla(0, 0%, 100%, 0.2) 0,\n    hsla(0, 0%, 100%, 0.3) 40%,\n    hsla(0, 0%, 100%, 0.4) 50%,\n    hsla(0, 0%, 100%, 0.5) 60%,\n    hsla(0, 0%, 100%, 0) 70%\n  )',
    },
    '.ripple-surface-black .ripple-wave': {
      backgroundImage:
        'radial-gradient(\n    circle,\n    rgba(0, 0, 0, 0.2) 0,\n    rgba(0, 0, 0, 0.3) 40%,\n    rgba(0, 0, 0, 0.4) 50%,\n    rgba(0, 0, 0, 0.5) 60%,\n    transparent 70%\n  )',
    },
  });
}, {});
