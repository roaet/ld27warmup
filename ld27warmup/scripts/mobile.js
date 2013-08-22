function Mobile(physics) {
    this.physics = physics;

    this.material = physics.createMaterial({
        density: 3
    });

    this.shapeSize = 1.0;

    this.shape = this.physics.createPolygonShape({
        vertices : this.physics.createBoxVertices(this.shapeSize,
                                                  this.shapeSize),
        material : this.material
    });

    this.sprite = Draw2DSprite.create({
        width : this.shapeSize,
        height : this.shapeSize,
        origin : [this.shapeSize / 2, this.shapeSize / 2],
        color : [1.0, 1.0, 1.0, 1.0]
    });
}

Mobile.prototype.getRigidBodyAt = function getRigidBodyAtFn(x, y) {
    if(!this.body) {
        console.log("Created body");
        this.body = this.physics.createRigidBody({
            shapes : [this.shape.clone()],
            position : [ x, y ],
            userData : this.sprite
        });
    }
    return this.body;
};

Mobile.prototype.draw = function drawFn(drawdevice) {
    var pos = [];
    this.body.getPosition(pos);
    this.sprite.x = pos[0];
    this.sprite.y = pos[1];
    this.sprite.rotation = this.body.getRotation();
    drawdevice.drawSprite(this.sprite);
};
