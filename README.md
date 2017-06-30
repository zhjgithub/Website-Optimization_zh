# Website-Optimization

> Project requirement to see practice-requirement.md.

Resolution of the website optimization project from Udacity.

## Quickstart

Use gulp to build. The src directory is code and assets, the dist diretory is build result.

### Dependencies

Need [npm](https://www.npmjs.com/get-npm) to run the build.

### Install build tools

```
$ npm install
```

### How to build

```
$ gulp default
```

## Sum of optimizations

### index.html

* Use [Web Font Loader](https://github.com/typekit/webfontloader) to load web font asynchronously
* Inline external CSS file
* Use media query to avoid render blocking CSS
* Use async to avoid parser block script
* Change small external images to base64 data URI
* Use gulp plugins to minify images and HTML/CSS/js files

### main.js

* Refactor loop code that trigger forced synchronous layout
* Or use requestAnimationFrame to avoid forced synchronous layout
* Use transform translateX instead of left to move pizzas to avoid layout recalculate
* Use will-change to promote moving pizzas to individual layer to avoid unnecessary paint

## Other Info

### Set up remote accessible local server

Start a local server with Python 2.7

```
$ cd project directory
$ python -m SimpleHTTPServer 8080
```

Download [ngrok](https://ngrok.com/) and execute ngrok.exe and run command below

```
$ ngrok http 8080
````

Wait a while and the url will displaye in the ngrok.exe window

### Set up GitHub project pages

Use [GitHub Project Site](https://pages.github.com/) to publish web page
