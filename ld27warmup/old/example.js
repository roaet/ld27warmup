/* {{ javascript("jslib/debug.js") }}*/
/* {{ javascript("jslib/webgl/turbulenzengine.js") }}*/
/* {{ javascript("jslib/webgl/graphicsdevice.js") }}*/
/* {{ javascript("jslib/draw2d.js") }}*/

TurbulenzEngine.onload = function onloadFn() {
    var graphicsDevice = TurbulenzEngine.createGraphicsDevice({});

    var draw2D = Draw2D.create({
        graphicsDevice: graphicsDevice
    });

    var r = 1.0, g = 1.0, b = 1.0, a = 1.0;
    var bgColor = [r, g, b, a];


    var x1 = 50;
    var y1 = 50;
    var x2 = graphicsDevice.width - 50;
    var y2 = graphicsDevice.height - 50;

    var rectangle = [x1, y1, x2, y2];

    var drawObject = {
        color: [1.0, 0.0, 0.0, 1.0],
        destinationRectangle: rectangle
    };

    var sprite = Draw2DSprite.create({
        width: 100,
        height: 100,
        x: graphicsDevice.width / 2,
        y: graphicsDevice.height / 2,
        color: [1.0, 1.0, 1.0, 1.0],
        rotiation: Math.PO / 4
    });

    var PI2 = Math.PI * 2;
    var rotateAngle = Math.PI / 32;

    var texture = graphicsDevice.createTexture ({
        src: "assets/spark.jpg",
        mipmaps: true,
        onload: function (texture) {
            if (texture) {
                sprite.setTexture(texture);
                sprite.setTextureRectangle([0, 0, texture.width, texture.height]);
            }
        }
    });

    function update() {
        b += 0.01;
        bgColor[2] = b % 1;

        sprite.rotation += rotateAngle;
        sprite.rotation %= PI2;


        if(graphicsDevice.beginFrame()) {
            graphicsDevice.clear(bgColor, 1.0);

            draw2D.begin();
            draw2D.draw(drawObject);
            draw2D.drawSprite(sprite);
            draw2D.end();

            graphicsDevice.endFrame();
        }
    }

    intervalID = TurbulenzEngine.setInterval(update, 1000 / 60);
};
