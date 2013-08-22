/*{{ javascript("jslib/observer.js") }}*/
/*{{ javascript("jslib/utilities.js") }}*/
/*{{ javascript("jslib/services/mappingtable.js") }}*/
/*{{ javascript("jslib/shadermanager.js") }}*/
/*{{ javascript("jslib/physics2ddevice.js") }}*/
/*{{ javascript("jslib/draw2d.js") }}*/
/*{{ javascript("jslib/boxtree.js") }}*/
/*{{ javascript("jslib/physics2ddebugdraw.js") }}*/
/*{{ javascript("jslib/textureeffects.js") }}*/
/*{{ javascript("scripts/mobile.js") }}*/

/*global TurbulenzEngine: true */
/*global TurbulenzServices: false */
/*global Physics2DDevice: false */
/*global Draw2D: false */
/*global Draw2DSprite: false */
/*global Physics2DDebugDraw: false */
/*global HTMLControls: false */

TurbulenzEngine.onload = function onloadFn() {

    //==========================================================================
    // Turbulenz Initialization
    //==========================================================================
    var gd = TurbulenzEngine.createGraphicsDevice({});
    var md = TurbulenzEngine.createMathDevice({});

    //==========================================================================
    // Mouse/Keyboard Controls
    //==========================================================================
    var inputDevice = TurbulenzEngine.createInputDevice({});
    var keyCodes = inputDevice.keyCodes;

    var w_pressed = false;
    var a_pressed = false;
    var s_pressed = false;
    var d_pressed = false;
    
    var onKeyUp = function onKeyUpFn(keynum) {
        if (keynum === keyCodes.R) {
            reset();
            console.log("Resetting world");
        }
        if (keynum === keyCodes.W) {
            w_pressed = false;
        }
        if (keynum === keyCodes.A) {
            a_pressed = false;
        }
        if (keynum === keyCodes.S) {
            s_pressed = false;
        }
        if (keynum === keyCodes.D) {
            d_pressed = false;
        }
    };
    var onKeyDown = function onKeyDownFn(keynum) {
        if (keynum === keyCodes.W) {
            w_pressed = true;
        }
        if (keynum === keyCodes.A) {
            a_pressed = true;
        }
        if (keynum === keyCodes.S) {
            s_pressed = true;
        }
        if (keynum === keyCodes.D) {
            d_pressed = true;
        }
    };
    inputDevice.addEventListener('keyup', onKeyUp);
    inputDevice.addEventListener('keydown', onKeyDown);


    //==========================================================================
    // Physics2D/Draw2D
    //==========================================================================
    var phys2D = Physics2DDevice.create();

    var stageWidth = 30;
    var stageHeight = 22;

    var draw2D = Draw2D.create({
        graphicsDevice : gd
    });
    var debug = Physics2DDebugDraw.create({
        graphicsDevice : gd
    });

    draw2D.configure({
        viewportRectangle : [0, 0, stageWidth, stageHeight],
        scaleMode : 'scale'
    });
    debug.setPhysics2DViewport([0, 0, stageWidth, stageHeight]);

    var world = phys2D.createWorld({
        gravity : [0, 0]
    });

    mob = new Mobile(phys2D);

    function reset() {
        world.clear();
        // Create a static border body around the stage to stop objects leaving the viewport.
        var thickness = 0.01; // 1 cm
        var border = phys2D.createRigidBody({
            type : 'static',
            shapes : [
                phys2D.createPolygonShape({
                    vertices : phys2D.createRectangleVertices(0, 0, thickness, stageHeight)
                }),
                phys2D.createPolygonShape({
                    vertices : phys2D.createRectangleVertices(0, 0, stageWidth, thickness)
                }),
                phys2D.createPolygonShape({
                    vertices : phys2D.createRectangleVertices((stageWidth - thickness), 0, stageWidth, stageHeight)
                }),
                phys2D.createPolygonShape({
                    vertices : phys2D.createRectangleVertices(0, (stageHeight - thickness), stageWidth, stageHeight)
                })
            ]
        });
        world.addRigidBody(border);
        world.addRigidBody(mob.getRigidBodyAt(stageWidth / 2, stageHeight / 2));

    }

    var realTime = 0;
    var prevTime = TurbulenzEngine.time;

    function mainLoop() {
        if (!gd.beginFrame()) {
            return;
        }

        inputDevice.update();
        gd.clear([0.5, 0.5, 0.5, 1.0]);

        var curTime = TurbulenzEngine.time;
        var timeDelta = (curTime - prevTime);

        if(timeDelta > (1 / 20)) {
            timeDelta = (1 / 20);
        }

        realTime += timeDelta;
        prevTime = curTime;

        while (world.simulatedTime < realTime) {
            world.step(1 / 60);
        }

        draw2D.begin('alpha', 'deferred');
        mob.draw(draw2D);
        draw2D.end();
        gd.endFrame();


    }

    reset();

    var intervalID;
    intervalID = TurbulenzEngine.setInterval(mainLoop, 1000 / 60);

    TurbulenzEngine.onunload = function destroyScene() {
        if (intervalID) {
            TurbulenzEngine.clearInterval(intervalID);
        }
    };
};
