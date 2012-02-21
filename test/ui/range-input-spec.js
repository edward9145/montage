/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
/*global require,exports,describe,it,expect,waits,runs */
var Montage = require("montage").Montage,
    TestPageLoader = require("support/testpageloader").TestPageLoader,
    ActionEventListener = require("montage/core/event/action-event-listener").ActionEventListener;

var testPage = TestPageLoader.queueTest("range-input-test", function() {
    var test = testPage.test;

    describe("ui/range-input-spec", function() {
        it("should load", function() {
            expect(testPage.loaded).toBe(true);
        });

        describe("RangeInput", function() {
            it("can be created", function() {
                expect(test.range_input1).toBeDefined();
            });

            it("can be changed", function() {
                expect(test.range_input1.value).toBe("0");

                var eventInfo = {
                    target: test.range_input1.element,
                    clientX: test.range_input1.element.offsetLeft + 30,
                    clientY: test.range_input1.element.offsetTop + 5
                };

                testPage.clickOrTouch(eventInfo);

                expect(test.range_input1.value).toBeGreaterThan(0);
            });

            describe("inside a scroller", function() {
                it("can be changed", function() {
                    expect(test.scroll_range.value).toBe("0");

                    var eventInfo = {
                        target: test.scroll_range.element,
                        clientX: test.scroll_range.element.offsetLeft + 30,
                        clientY: test.scroll_range.element.offsetTop + 5
                    };

                    testPage.clickOrTouch(eventInfo);

                    expect(test.range_input1.value).toBeGreaterThan(0);
                });

                it("doesn't surrender the pointer", function() {
                    var el, scroll_el, listener, originalValue;
                    el = test.scroll_range.element;
                    scroll_el = test.scroll.element;

                    // mousedown
                    testPage.mouseEvent({target: el}, "mousedown");

                    expect(test.scroll.eventManager.isPointerClaimedByComponent(test.scroll._observedPointer, test.scroll)).toBe(false);

                    // Mouse move doesn't happen instantly
                    waits(10);
                    runs(function() {
                        // mouse move up

                        var moveEvent = document.createEvent("MouseEvent");
                        // Dispatch to scroll view, but use the coordinates from the
                        // button
                        moveEvent.initMouseEvent("mousemove", true, true, scroll_el.view, null,
                                el.offsetLeft, el.offsetTop - 100,
                                el.offsetLeft, el.offsetTop - 100,
                                false, false, false, false,
                                0, null);
                        scroll_el.dispatchEvent(moveEvent);

                        expect(test.scroll_range.value).toBe("0");
                        expect(test.scroll.eventManager.isPointerClaimedByComponent(test.scroll._observedPointer, test.scroll)).toBe(false);

                        // mouse up
                        testPage.mouseEvent({target: el}, "mouseup");
                        testPage.mouseEvent({target: el}, "click");
                    });

                });
            });
        });
    });
});