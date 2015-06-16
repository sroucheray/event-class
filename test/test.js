import EventClass from "EventClass";
/*import Qunit from "jquery/qunit";*/


class DummyClass extends EventClass{
}

QUnit.module("Simple trigger");
QUnit.test("Test trigger", function( assert ) {
    let done = assert.async();
    let dummyObject = new DummyClass();

    dummyObject.on("change", function(){
        assert.ok(true);
        done();
    });

    dummyObject.trigger("change");
});

QUnit.test("Test this", function( assert ) {
    let done = assert.async();
    let dummyObject = new DummyClass();

    dummyObject.on("change", function(){
        assert.equal(this, dummyObject);
        done();
    });

    dummyObject.trigger("change");
});

QUnit.test("Test data", function( assert ) {
    let done = assert.async();
    let dummyObject = new DummyClass();

    dummyObject.on("change", function(data){
        assert.equal("test", data.test);
        done();
    });

    dummyObject.trigger("change", { test: "test"});
});

QUnit.test("Test two triggers", function( assert ) {
    let tests = 0;
    assert.expect(2);
    let done = assert.async();
    let dummyObject = new DummyClass();

    dummyObject.on("change", function(){
        assert.ok(true);
        tests++;
        if(tests === 2){
            done();
        }
    });

    dummyObject.trigger("change");
    dummyObject.trigger("change");
});


QUnit.module("Simple channel trigger");
QUnit.test("Test trigger", function( assert ) {
    let done = assert.async();
    let dummyObject = new DummyClass();

    dummyObject.on("change", function(){
        assert.ok(true);
        done();
    });

    dummyObject.trigger("change");
});

QUnit.test("Test this", function( assert ) {
    let done = assert.async();
    let dummyObject = new DummyClass();

    dummyObject.on("change:value", function(){
        assert.equal(this, dummyObject);
        done();
    });

    dummyObject.trigger("change:value");
});

QUnit.test("Test data", function( assert ) {
    let done = assert.async();
    let dummyObject = new DummyClass();

    dummyObject.on("change:value", function(data){
        assert.equal("test", data.test);
        done();
    });

    dummyObject.trigger("change:value", { test: "test"});
});

QUnit.test("Test two triggers", function( assert ) {
    let tests = 0;
    assert.expect(2);
    let done = assert.async();
    let dummyObject = new DummyClass();

    dummyObject.on("change:value", function(){
        assert.ok(true);
        tests++;
        if(tests === 2){
            done();
        }
    });

    dummyObject.trigger("change:value");
    dummyObject.trigger("change:value");
});


QUnit.module("Sub channel trigger");
QUnit.test("Test sub channel trigger", function( assert ) {
    let done = assert.async();
    let dummyObject = new DummyClass();

    dummyObject.on("change", function(){
        assert.ok(true);
        done();
    });

    dummyObject.trigger("change:object");
});
QUnit.test("Test sub channel no trigger", function( assert ) {
    let done = assert.async();
    assert.expect(1);
    let dummyObject = new DummyClass();

    dummyObject.on("change:object", function(){
        assert.notOk();
    });

    dummyObject.on("change", function(){
        assert.ok(true);
    });

    dummyObject.trigger("change");
    done();
});


QUnit.module("Sub sub channel trigger");
QUnit.test("Test sub sub channel trigger", function( assert ) {
    let done = assert.async();
    let dummyObject = new DummyClass();

    dummyObject.on("change", function(){
        assert.ok(true);
        done();
    });

    dummyObject.trigger("change:object:attribute");
});
QUnit.test("Test sub sub channel no trigger", function( assert ) {
    let done = assert.async();
    assert.expect(1);
    let dummyObject = new DummyClass();

    dummyObject.on("change:object:attribute", function(){
        assert.notOk();
    });

    dummyObject.on("change", function(){
        assert.ok(true);
    });

    dummyObject.trigger("change:object");
    dummyObject.trigger("change:attribute");
    done();
});


QUnit.module("Remove listener (off)");
QUnit.test("Simple off", function( assert ) {
    let done = assert.async();
    assert.expect(0);
    let dummyObject = new DummyClass();

    function namedCallback(){
        assert.notOk(true);
    }

    dummyObject.on("change", namedCallback);
    dummyObject.off("change", namedCallback);

    dummyObject.trigger("change");
    done();
});
QUnit.test("Sub channel off", function( assert ) {
    let done = assert.async();
    assert.expect(0);
    let dummyObject = new DummyClass();

    function namedCallback(){
        assert.notOk(true);
    }

    dummyObject.on("change:object", namedCallback);
    dummyObject.off("change:object", namedCallback);

    dummyObject.trigger("change:object");
    done();
});
