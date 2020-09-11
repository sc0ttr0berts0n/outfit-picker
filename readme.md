# MRI Simple Node Project

This gamified offer has been split into individual modules. In `src/scss` is style code split out by module. (Header, Footer, Offer, Main, etc). These are standard across all of the other modularized gamified offers.

## When Updating

in `src/scss/_variables` is a list of quickly styleable variables that change often between jobs. As much as possible, update this before reworking the modules themselves. From time to time, it may be necessary to update or adjust the raw values in the modules, and when doing so, just be sure to keep with the methods and styles put in place already.

# MRI Simple Node

This site has a very simple node / gulp based build process that is intended to be "just enough" to get the task done.This should make it very simple to first-time setup / debug. It compiles Js down to one ES5 specced file, and compiles scss to css. Please reach out to someone from Digital at MRI if you have any trouble.

## To install

1. Install [node.js](https://nodejs.org/)

2. In your terminal of choice, navigate to this directory and type the following:

```sh
npm install
# - or if you prefer yarn: -
yarn
```

## To run Watcher / Server or Build files

```sh
# to watch files and create a server
gulp

# to build files
gulp build

# to build files for production (minify, no source maps)
gulp build --production
```
