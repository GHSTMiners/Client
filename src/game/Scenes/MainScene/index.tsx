import Config from "config";
import GlobalRenderer from "game/Rendering/GlobalRenderer";
import * as Phaser from "phaser"
var controls;

export default class LoadingScene extends Phaser.Scene {
    graphics!: Phaser.GameObjects.Graphics;
    newGraphics!: Phaser.GameObjects.Graphics;
    controls!: Phaser.Cameras.Controls.SmoothedKeyControl
    constructor() {
        super({key: 'MainScene'})
    }

    create() {
        this.globalRenderer = new GlobalRenderer(this)

        var cursors = this.input.keyboard.createCursorKeys();

        var controlConfig = {
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            acceleration: 0.06,
            drag: 0.0005,
            maxSpeed: 1.0
        };
    
        this.cameras.main.scrollY = -(this.cameras.main.height - Config.blockHeight*2)
        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
    }

    update(time: number, delta: number): void {
        //Configure camera bounds
        this.globalRenderer?.update();
        this.controls.update(delta);
    }

    private globalRenderer? : GlobalRenderer
}