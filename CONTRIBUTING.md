# Contributing

I *really* welcome contributions! Please feel free to fork and issue pull requests when...

* You have a very nice idea to improve this plugin!
* You found a bug!
* You're good at English and can help my bad English!

For IE problems, please refer to [IE Support](https://github.com/noraesae/perfect-scrollbar#ie-support).

## Introduction
First of all, thank you in advance for your contribution!

This document will introduce something you should know before making some contributions to **perfect-scrollbar**. I'll try to explain as easy as possible. If there are something missed or not well-documented, please let me know.

Email: me@noraesae.net

## Directory Structure
Please don't edit files in the `out` subdirectory as they are generated via Gulp. You'll find source code in the `src` subdirectory!

`examples` directory is for the example sources. If you have any example you want to add with a new feature, please add it in the directory.

## Code Conventions
Regarding code style like indentation and whitespace, **follow the conventions you see used in the source already.**

Basically, I try to follow [Douglas Crockford's JavaScript Code Conventions](http://javascript.crockford.com/code.html).

You can check if your code fits in the convention with `gulp lint`.

## Getting Started
First, ensure that you have stable [Node.js](https://nodejs.org/) and [npm](https://npmjs.com) installed.

Test if Gulp CLI is installed by running `gulp --version`.  If the command isn't found, run `npm install -g gulp`.  For more information about installing Gulp, see the Gulp's [Getting Started](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md).

If `gulp` is installed, follow the steps below.

1. Fork and clone the repo.
1. Run `npm install` to install all dev dependencies.
1. Run `gulp` to check if Gulp works well.

Assuming that you don't see any error, you're ready to go.

## Linting Sources

You can use `gulp lint` command to lint the source files. If there're warnings with the command, it means that there are something that don't fit into the convention. Please modify the source to fit.

## Building Sources

You can use the `gulp build` command to build source files into output files.

If you want to watch the modification and build automatically during development, use the `gulp serve` command. It'll automatically rebuild the code when there's any change in it. It will also reload example pages, which is quite helpful.

## Submitting pull requests

1. Create a new branch. Working in your `master` branch is okay, but not recommended.
1. Modify the sources.
1. Run `gulp` to see if the code fit into the code convention and build without an error. Repeat steps 2-3 until done.
1. Update the documentation to reflect any changes.
1. Create examples if needed.
1. Push to your fork and submit a pull request.

For further information about pull requests, please refer to GitHub's [Using Pull Requests](https://help.github.com/articles/using-pull-requests).

## Code Review

When the pull request is created, anyone can review the source code. After the review is finished and the patch doesn't have any problem, it'll be merged.

## Conclusion

The process looks somewhat difficult, but it's necessary to avoid maintanance issues and make the code easy to read and use.

If there is any opinion or question, please feel free to contact me.

Email: me@noraesae.net
