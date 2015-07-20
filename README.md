[![Build Status](https://travis-ci.org/sroucheray/event-class.svg?branch=master)](https://travis-ci.org/sroucheray/event-class)
# Easy JavaScript/ES6 Events

Trigger and listen to events the ES6 way.

This script is an ES6 `module`. It exports a simple ES6 `class`.

## API

The `class` provided in this `module` can be directly instantiated or can extend your own class.

```javascript
import EventClass from "event-class";

class AnyClass extends EventClass{}

let anyObject = new AnyClass();
let otherObject = new EventClass();
```

The `EventClass` provides only four methods to its instances `on` to register handlers and its counterpart `trigger` to emit events, `once` similar to `on` but for one time only and `off` to stop listening to a specific event.

### .on(`event`, `callback`)
---
Attaches the `callback` to the `event` triggering.

`event` is a string representing one or several events separated by space or coma.
Examples of valid events are :
* `"init"`
* `"change"`
* `"init change"`

Each event can be more specific using colons. In this case you create event channels.
Other valid events are :
* `"change:name"`
* `"change:attribute:gender"`

When listening to an event you listen also to all the channels of this event. By listening to `"change"`, you'll be notified when `"change:name"` and `"change:attribute:gender"` are triggered. By listening to `"change:attribute"` you won't be notified when `"change:name"` is triggered.

You can mix channels and multiple events.
Other valid events are :
* `"init change:name"`
* `"change:name change:attribute:gender"`

<br>
`callback` is a function called when the listened event is triggered.
If multiple callbacks listen to the same event they are called in order. `callback` as a single arguments, the data passed to the `trigger` method.


### .trigger(`event`, `data`)
---
`event` is a string representing one or several events separated by space or coma.
The `event` string has the same caracteristics as for the `on` method.
<br><br>
`data` can be anything and will be passed to the callback handlers.

### .once(`event`, `callback`)
---
Idem as `on` but is `off`ed after the first trigger.

### .off(`event`, `callback`)
---
Detaches the `callback` from the event triggering.

`event` is a string representing one or several events separated by space or coma.
The `event` string has the same caracteristics as for the `on` method.
<br><br>
`callback` is the function used by `on` or `one`.

## Example

```javascript
import EventClass from "event-class";

// Extends
class AnyClass extends EventClass{
}

let anyObject = new AnyClass();

function namedFunction(data){
    console.log("change event :", data);
}

// Listen to the 'change' event
anyObject.on("change", namedFunction);

// Listen once to the 'change:attribute' event
anyObject.once("change:attribute", function(data){
    console.log("change:attribute event :", data);
});

anyObject.trigger("change:attribute", "Hello 1 !");
anyObject.trigger("change:attribute", "Hello 2 !");
anyObject.off("change", namedFunction);
anyObject.trigger("change:attribute", "Hello 3 !");



/* console output
> change:attribute event : Hello 1 !
> change event : Hello 1 !
> change event : Hello 2 !

No output with "Hello 3 !" because there is no listener anymore
*/

/* How to listen to or to trigger several events at the same time */
// Space separated events style
anyObject.on("change:attribute change:value ping");
anyObject.trigger("change:attribute change:value ping");

// Coma separated events style
anyObject.on("change:attribute, change:value, ping");
anyObject.trigger("change:attribute, change:value, ping");
```

## Installation

Use [jspm](http://jspm.io/) to eases the use of ES6 features, the package is installed from the npm registry

```bash
jspm install npm:event-class
```
or simply use npm

```bash
npm install event-class --save
```