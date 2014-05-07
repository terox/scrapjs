# ScrapJS

A super **easy**, **small** and **extensible** NodeJS library for scraping the web.

## Features

* Easy installation and use.
* It use **promises** inside.
* You can **save your manifest** in a JSON file or in a MongoDB collection, for example, to retrieve it later.
* It can be **extended** by customized modules or filters for repetitive tasks.
* It uses a fantastic **Cheerio library** to query and traversing in the DOM.
* And more.

## Getting started

A quick example that as extract the "On this day" section in [wikipedia.org](http://www.wikipedia.org):
```js
var scrap = require('scrapjs').Scrap;

var manifest = {
    url: "http://en.wikipedia.org/wiki/Main_Page",
    model: {
        on_this_day: {
            // A module
            $query: "#mp-otd > ul > li",
            // Another module
            $each: {
                // A pipe filter
                year: "a | get 0 | text",
                note: "this | text",
            }
        },
        generator: "wikipedia.org"
    }
}

var s = new scrap(manifest);
s.done(function(result) {
    console.log(result)
});
```

The output is a JSON:
```json
{
   "on_this_day":[
      {
         "year":"708",
         "note":"708 – Pope Constantine was selected as one of the last popes of the Byzantine Papacy; he would be the last pope to visit Constantinople until Pope Paul VI in 1967."
      },
      {
         "year":"1410",
         "note":"1410 – The Yongle Emperor launched the first of his military campaigns against the Mongols, resulting in the fall of the Mongol khan Bunyashiri."
      },
      {
         "year":"1911",
         "note":"1911 – The Triangle Shirtwaist Factory fire (pictured) in New York City killed more than 140 sweatshop workers, many of whom could not escape because the doors to the stairwells and exits had been locked."
      },
      {
         "year":"1931",
         "note":"1931 – The Scottsboro Boys were arrested and charged with rape, leading to a legal case that eventually established legal principles in the United States that criminal defendants are entitled to effective assistance of counsel."
      },
      {
         "year":"1949",
         "note":"1949 – The Soviet Union began mass deportations of more than 90,000 people from the Baltic states to Siberia."
      }
   ],
   "generator":"wikipedia.org"
}
```
It's easy extract data in JSON and storage or convert to other formats.

And you are right, you can extend Scrapjs with your own modules and filters.

### Installation

```
npm install scrapjs
```

### How it works

Scrapjs needs a manifest object that tells Scrapjs how site needs to be examinated. A basic manifest is composed by:

* **url** to scrapping.
* **model** who describes what paths we extract information.

For example:
```js
var manifest = {
    url: "http://en.wikipedia.org/wiki/Main_Page",
    model: {
        on_this_day: {
            $query: "#mp-otd > ul > li",
            $each: {
                // A pipe filter
                year: "a | get 0 | text",
                note: "this | text",
            }
        },
        generator: "wikipedia.org"
    }
}
```
In this model you can observe `$query` and `$each`, they are modules. Modules in Scrapjs allow iterates and taversing over DOM tree. The modules don't appear in the final JSON object, but his properties contents would can appear. It depends on the module.
See *Modules* section to know more about modules that come with Scrapjs.

In the above example `$query` creates a context and `$each` iterates over each *li* elements. Inside $each we have two properties: `year` and `note`.
This properties are string and can do querys to the current context (remember que previus $query) and transforms the results with a pipes, like a UNIX hacker.

## Pipes

A pipe can be used in any property:
```js
{
  my_attribute: 'DOM_QUERY | attr title | uppercase'
}
```
* **DOM_QUERY** is a DOM query, like `ul > li`, `li a` or `a`. It depends on the context. You can create a context with `$query` module.
* **attr title** is a filter with one argument.
* **uppercase** is a filter without arguments.

You can use the wildcard **this** in *DOM_QUERY* to referer to the current context.
Read the next section to know more about the filters

## Filters

The filters are used in pipes and transforms the input.

The HTHL of website:
```html
<a href="http://wikipedia.org" title="The Wikipedia">Wikipedia</a>
```
The Scrapjs model:
```js
//...
{
    link_href: 'a | attr href | uppercase'
}
//...

```
The final output:
```json
{
    "link_href": "HTTP://WIKIPEDIA.ORG"
}

```

### attr <attr name>

Get an attribute of current element. You can get HTML5 data elements: *data-custom="my value"*

### get <index>

If the current context contains a list of elements you can select the one you want (`:eq` in jQuery)

### text

If your current context or element have inside HTML tags return online the text without tags (`.text()` in jQuery)

### trim

Delete side whitespaces in string

### lowercase

Convert the string to lowercase

### uppercase

Convert the string to uppercase

### Creating a filter

With Scrapjs you can create customized filters.

```js
// Soon

```

## Modules


### $query: \<str QUERY\>

Creates a context making a query to DOM.

### $each: \<Object\>

Iterates over each element of current context. The properties of object are injectet in final JSON object (see the main example)

### $follow: \<Manifest Object\>

It allows you to include information from another related page. For example:

```js
{
   // ...
   my_link: 'a | attr href'
   // $follows contain a new manifest
   description: {
      $follow: {
          // Only $follow allow use pipes in url
          url: 'li a | attr href',
          model: {
              // The model to examine 
          }
      }
   }
   // ...
}
```

### $context: \<str ACTION\>

This module allows you to work with the current context. Avaible actions:

* **reset**: the context is the root element. If you made a query with `$query` this is destroyed.

### Creating a module

Create a module can be easy or a complex task. It depends on your idea, but the basic idea is this:

```js
// Soon
```

## Disclaimer
Use this library at your own risk. I do not take responsibility for any damage or injury.

## License

(The MIT License)

Copyright (c) 2014 David Pérez Terol &lt;davidtxnet@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
