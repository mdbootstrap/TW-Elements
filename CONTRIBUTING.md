# Contributing

I *really* welcome contributions! Please feel free to fork and issue pull
requests when...

* You have a very nice idea to improve this plugin!
* You found a bug!
* You're good at English and can help my bad English!

For IE problems, please refer
to [IE Support](https://github.com/utatti/perfect-scrollbar#ie-support).

## Introduction

First of all, thank you in advance for your contribution!

This document will introduce something you should know before making some
contributions to **perfect-scrollbar**. I'll try to explain as easy as
possible. If there are something missed or not well-documented, please let me
know.

Also, the project is not actively maintained. No maintainer is paid, and most of
us are busy on our professional or personal works. Please understand that it may
take a while for an issue to be resolved. Uploading a PR would be the fastest
way to fix an issue.

## Directory structure

Please don't edit files in the `dist` directory as they should only be
updated on releases. You'll find source code in the `src` directory.

Files concerning CSS is placed in the `css` directory.

`examples` directory is for the example sources. If you have any example you
want to add with a new feature, please add it in the directory.

`docs` is for GitHub Pages.

## Getting started

First, ensure that you have stable [Node.js](https://nodejs.org/)
and [npm](https://npmjs.com) 5 installed.

After basic installation, follow the steps below.

1. Fork and clone the repo.
1. Run `npm install` to install all dev dependencies.
1. Run `npm test` to check if everything's well.

Assuming that you don't see any error, you're ready to go.

## Code conventions

[Prettier](https://github.com/prettier/prettier) is used for code
formatting. Please `npm run format` before each commit.

## Building sources

You can use the `npm run build` command to build source files into output files.

## Submitting pull requests

1. Create a new branch. Working in your `master` branch is okay, but not
   recommended.
1. Modify the sources.
1. Run `npm test` to see if the code fit into the code convention and build
   without an error. Repeat steps 2-3 until done.
1. Update the documentation to reflect any changes.
1. Create examples if needed.
1. Push to your fork and submit a pull request.

For further information about pull requests, please refer to
GitHub's [Using Pull Requests](https://help.github.com/articles/using-pull-requests).

## Code Review

When the pull request is created, anyone can review the source code. After the
review is finished and the patch doesn't have any problem, it'll be merged.

## Conclusion

The process looks somewhat difficult, but it's necessary to avoid maintanance
issues and make the code easy to read and use.

If there is any opinion or question, please feel free to ask me.
