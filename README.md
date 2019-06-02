# postman-kosmo
Parameter management for Postman requests.

## Overview
Postman is an absolutely awesome REST client and API development tool. But I think there's one pretty HUGE miss in the user interface - parameter management.

Postman does an excellent job of letting the user define environments and some shared variables, but there's no dead simple way to switch between use cases as you're developing or debugging. For myself this meant one of two solutions would be at play:

1. **Make a separate Postman request representing each potential combination of parameters.** Great for testing, not so great for active development. On the one hand you get a collection of single requests documenting certain use cases. On the other, if you make changes to the API you have to edit every single one of those specific requests.
2. **Keep sets of parameters in external text files and paste in values one-by-one as needed.** ... I think the pain here is self-explanatory.

Even in simple APIs this situation can be frustrating. 

What's missing is a way to separate *how* a request is made (the request structure) from *what* it should consume (the request data or parameters.) Kosmo attempts to solve this.

Kosmo is a very lightweight JavaScript Pre-request script which provides a way to build and document collections of parameters for your API, and a simple way to quickly swap between collections. The sample collection provided also demonstrates how to build more complex and better modularized compositions of parameters to make working with complex APIs a bit easier to manage.

## How it Works

Kosmo is just a small JavaScript function implemented in a Postman request Pre-request script. That's it.

You create a standalone request (ideally a no-op request to localhost at a dead port), drop the *contents* of `kosmo.js` at the top of the request's Pre-request script editor, create a JSON object below that to define the parameters you want to use in you API requests, and use Kosmo to set those parameters as Postman Globals.

Kosmo will recurse the JSON object provided to the `setParamsByObject` function. Any props with `object` values will be traversed into and scanned for parameters. All other props are assumed to be valid name-value pairs that you want to inject as variables in your Postman Workspace's Global variables set.

Kosmo also provides a cleanup function, `clearParams`, which will remove all (and *only*) the values it most recently set, so you can keep your Workspace clean when you need to.

## Usage

The easiest way to get up and running is to:

1. Download the sample collection JSON provided in this repo.
2. Import it to your Postman workspace.
3. Open the `Kosmo Parameters` collection.
4. Open the `Kosmo Parameters` request.
5. Click the `Pre-request Scripts` tab.
6. Setup your own parameters JSON object.
7. Pass your newly minted JSON object to the `setParamsByObject` function at the bottom of the script.
8. Click `Send`.

---

For a more custom start ...
```javascript
// This the Pre-request script editor for you parameter management no-op request.
// Somewhere above this point you've pasted in the contents of kosmo.js.
const kosmo = Kosmo() // Instantiate Kosmo

// Define a JSON object of parameters. 
var params = {
  PARAM_1: 42,
  PARAM_2: "someperson@email.com",
  PARAM_3: "imauserid"
}

// ... Potentially more parameter objects here.

// Pass your parameters object to the setup function
kosmo.setParamsByObject(params) 

// Click SEND on the request.
```

Once you hit the `Send` button, your parameters will be available as Global variables in your Workspace, and you can wire those parameters up to your requests. When you execute your request, Postman pulls the Globals in by name (e.g. "PARAM_1"), so the name you use in your parameters JSON object, is the same exact name you'll use in your Postman API request.

```javascript
// Sample JSON body for API request.
{
  answerToLife: {{PARAM_1}},
  email: "{{PARAM_2}}",
  userId: "{{PARAM_3}}"
}
```

When it's time to change parameters for a different use case add another parameters object and pass it to the `setParamsByObject` function instead. Then click `Send`.

```javascript
// ...

// Define a JSON object of parameters. 
var params = {
  PARAM_1: 42,
  PARAM_2: "someperson@email.com",
  PARAM_3: "imauserid"
}

// Define a different set of parameters for a different scenario.
var otherParams = {
  PARAM_1: 42,
  PARAM_2: "vegeta@gmail.com",
  PARAM_3: "veg9000"
}

// Pass your parameters object to the setup function
kosmo.setParamsByObject(otherParams) 

// Click SEND on the request.
```
![Params swapped quickly](https://raw.githubusercontent.com/wileymab/postman-kosmo/master/docs/images/kosmo-param-swap.gif)



<!-- 
![Params have been set](https://raw.githubusercontent.com/wileymab/postman-kosmo/master/docs/images/params-example.png)
![Params have been cleared](https://raw.githubusercontent.com/wileymab/postman-kosmo/master/docs/images/params-cleared-example.png)
-->
