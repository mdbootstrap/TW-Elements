# Tailwind Elements

### Collection of free, popular components like modal, dropdown, carousel, popover, cards, charts and many more.

<a href="https://twitter.com/intent/tweet/?text=Thanks+@TailwindElement+for+creating+an+amazing+collection+of+open+source+components+for+@tailwindcss%20https://tailwind-elements.com/&hashtags=tailwindCSS,bootstrap,webdesign,javascript,100DaysOfCode,DevCommunity"><img src="https://img.shields.io/twitter/url/http/shields.io.svg?style=social&label=Let%20us%20know%20you%20were%20here%21&"></a>

---

[![Tailwind Elements](https://tailwind-elements.com/img/logo.png)](https://tailwind-elements.com/)

Tailwind Elements **is a plugin** that extends the functionality of the library with many interactive components.

In some dynamic components (like dropdowns or modals) we add Font Awesome icons and custom JavaScript. However, they do not require any additional installation, all the necessary code is always included in the example and copied to any Tailwind project - it will work.

---

## Quick Start tutorial

##### NPM

1. Before starting the project make sure to install [Node.js (LTS)](https://nodejs.org/en/ 'Node.js (LTS)') and [TailwindCSS](https://tailwindcss.com/ 'TailwindCSS').

2. Run the following command to install the package via NPM:

```
npm install tw-elements
```

3. Tailwind Elements is a plugin and should be included inside the **tailwind.config.js** file. It is also recommended to extend the content array with a js file that loads dynamic component classes:

```javascript
module.exports = {
  content: ['./src/**/*.{html,js}', './node_modules/tw-elements/dist/js/**/*.js'],
  plugins: [require('tw-elements/dist/plugin')],
};
```

4.  Dynamic components will work after adding the js file:

```
<script src="./TW-ELEMENTS-PATH/dist/js/index.min.js"></script>
```

Alternatively, you can import it in the following way (bundler version):

```
import 'tw-elements';
```

##### MDB GO / CLI

Create, deploy and host anything with a single command.

1. To start using MDB GO / CLI install it with one command:

```
npm install -g mdb-cli
```

2. Log into the CLI using your MDB account:

```
mdb login
```

3. Initialize a project and choose **Tailwind Elements** from the list:

```
mdb init
```

4. Install the dependencies (inside the project directory):

```
npm install
```

5. Run the app:

```
npm start
```

6. Publish when you're ready:

```
mdb publish
```

##### CDN

You can easily test Tailwind Elements by adding CDN scripts to your classic HTML template without the need for installing any packages.

Add the stylesheet files below in the _head_ section:

```
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tw-elements/dist/css/index.min.css" />
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
      }
    }
  }
</script>
```

Require the js bundled file right before the _body_ closing tag:

```
<script src="https://cdn.jsdelivr.net/npm/tw-elements/dist/js/index.min.js"></script>
```
