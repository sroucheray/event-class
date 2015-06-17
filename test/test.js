import EventClass from "EventClass";
import QUnit from "jquery/qunit";

class DummyClass extends EventClass{
}

QUnit.module("Private methods");
QUnit.test("Test _getChannels", function( assert ) {
    let dummyObject = new DummyClass();

    let result = dummyObject._getChannels("change");

    assert.equal(result.length, 1);
    assert.equal(result[0], "change");

    result = dummyObject._getChannels("test, change");

    assert.equal(result.length, 2);
    assert.equal(result[0], "test");
    assert.equal(result[1], "change");

    result = dummyObject._getChannels("test change");

    assert.equal(result.length, 2);
    assert.equal(result[0], "test");
    assert.equal(result[1], "change");

    result = dummyObject._getChannels("  test2 change2,  change3");

    assert.equal(result.length, 3);
    assert.equal(result[0], "test2");
    assert.equal(result[1], "change2");
    assert.equal(result[2], "change3");
});
QUnit.test("Test _getNameSpaces", function( assert ) {
    let dummyObject = new DummyClass();

    let result = dummyObject._getNameSpaces("change");

    assert.equal(result.length, 1);
    assert.equal(result[0], "change");

    result = dummyObject._getNameSpaces("change:test");

    assert.equal(result.length, 2);
    assert.equal(result[0], "change:test");
    assert.equal(result[1], "change");

    result = dummyObject._getNameSpaces(" change:test2 ");

    assert.equal(result.length, 2);
    assert.equal(result[0], "change:test2");
    assert.equal(result[1], "change");

    result = dummyObject._getNameSpaces(" change:test2:attribute");

    assert.equal(result.length, 3);
    assert.equal(result[0], "change:test2:attribute");
    assert.equal(result[1], "change:test2");
    assert.equal(result[2], "change");

});

QUnit.module("Simple trigger");
QUnit.test("Test trigger", function( assert ) {
    let dummyObject = new DummyClass();

    dummyObject.on("change", function(){
        assert.ok(true);
    });

    dummyObject.trigger("change");
});

QUnit.test("Test this", function( assert ) {
    let dummyObject = new DummyClass();

    dummyObject.on("change", function(){
        assert.equal(this, dummyObject);
    });

    dummyObject.trigger("change");
});

QUnit.test("Test data", function( assert ) {
    let dummyObject = new DummyClass();

    dummyObject.on("change", function(data){
        assert.equal("test", data.test);
    });

    dummyObject.trigger("change", { test: "test"});
});

QUnit.test("Test two triggers", function( assert ) {
    assert.expect(2);
    let dummyObject = new DummyClass();

    dummyObject.on("change", function(){
        assert.ok(true);
    });

    dummyObject.trigger("change");
    dummyObject.trigger("change");
});


QUnit.module("Simple channel trigger");
QUnit.test("Test trigger", function( assert ) {
    let dummyObject = new DummyClass();

    dummyObject.on("change", function(){
        assert.ok(true);
    });

    dummyObject.trigger("change");
});

QUnit.test("Test this", function( assert ) {
    let dummyObject = new DummyClass();
    assert.expect(2);

    dummyObject.on("change:value", function(){
        assert.equal(this, dummyObject);
    });

    dummyObject.once("change:othervalue", function(){
        assert.equal(this, dummyObject);
    });

    dummyObject.trigger("change:value");
    dummyObject.trigger("change:othervalue");
});

QUnit.test("Test data", function( assert ) {
    let dummyObject = new DummyClass();

    dummyObject.on("change:value", function(data){
        assert.equal("test", data.test);
    });

    dummyObject.trigger("change:value", { test: "test"});
});

QUnit.test("Test two triggers", function( assert ) {
    assert.expect(2);
    let dummyObject = new DummyClass();

    dummyObject.on("change:value", function(){
        assert.ok(true);
    });

    dummyObject.trigger("change:value");
    dummyObject.trigger("change:value");
});


QUnit.module("Sub channel trigger");
QUnit.test("Test sub channel trigger", function( assert ) {
    let dummyObject = new DummyClass();

    dummyObject.on("change", function(){
        assert.ok(true);
    });

    dummyObject.trigger("change:object");
});
QUnit.test("Test sub channel no trigger", function( assert ) {
    assert.expect(1);
    let dummyObject = new DummyClass();

    dummyObject.on("change:object", function(){
        assert.notOk();
    });

    dummyObject.on("change", function(){
        assert.ok(true);
    });

    dummyObject.trigger("change");
});


QUnit.module("Sub sub channel trigger");
QUnit.test("Test sub sub channel trigger", function( assert ) {
    let dummyObject = new DummyClass();

    dummyObject.on("change", function(){
        assert.ok(true);
    });

    dummyObject.trigger("change:object:attribute");
});
QUnit.test("Test sub sub channel no trigger", function( assert ) {
    assert.expect(2);
    let dummyObject = new DummyClass();

    dummyObject.on("change:object:attribute", function(){
        assert.ok(false);
    });

    dummyObject.on("change", function(){
        assert.ok(true);
    });


    dummyObject.trigger("change:object");
    dummyObject.trigger("change:attribute");
});


QUnit.module("Remove listener (off)");
QUnit.test("Simple off", function( assert ) {
    assert.expect(0);
    let dummyObject = new DummyClass();

    function namedCallback(){
        assert.notOk(true);
    }

    dummyObject.on("change", namedCallback);
    dummyObject.off("change", namedCallback);

    dummyObject.trigger("change");
});
QUnit.test("Sub channel off", function( assert ) {
    assert.expect(0);
    let dummyObject = new DummyClass();

    function namedCallback(){
        assert.notOk(true);
    }

    dummyObject.on("change:object", namedCallback);
    dummyObject.off("change:object", namedCallback);

    dummyObject.trigger("change:object");
});

QUnit.module("Once callback");
QUnit.test("Once callback", function( assert ) {
    let dummyObject = new DummyClass();

    dummyObject.once("change", function(){
        assert.ok(true);
    });

    dummyObject.trigger("change");
});
QUnit.test("Off on once callback", function( assert ) {
    let dummyObject = new DummyClass();
    assert.expect(0);

    function namedCallback(){
        assert.notOk(true);
    }

    dummyObject.once("change", namedCallback);
    dummyObject.off("change", namedCallback);

    dummyObject.trigger("change");
});

QUnit.config.autostart = true;
QUnit.load();