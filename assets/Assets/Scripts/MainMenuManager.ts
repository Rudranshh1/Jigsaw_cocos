import { _decorator, Component, director, Node,resources,SpriteFrame,Sprite, Scene, UITransform, Layers, Button, EventHandler } from 'cc';
import { GameDataCenter } from './GameDataCenter';
const { ccclass, property } = _decorator;

@ccclass('MainMenuManager')
export class MainMenuManager extends Component {

    @property(Node)
    private PuzzleImageSelectionPage:Node = null;
    @property(Node)
    private PuzzleGridSelectionPage:Node = null;
    @property(Node)
    private PuzzleImageContainer:Node = null;
    // @property(Node)
    // private PuzzleImageNode:Node = null;
    protected onLoad(): void {
        resources.loadDir('JigsawAssets', SpriteFrame, (err, spriteFrames) => {
            if (err) {
                console.error('Failed to load directory:', err);
                return;
            }
            
            // spriteFrames is an array of loaded SpriteFrame objects
            console.log('Loaded SpriteFrames:', spriteFrames);

            // Process each image (e.g., assign them to sprites, etc.)
            spriteFrames.forEach((spriteFrame, index) => {
                let newNode = new Node(`ImageNode${index}`);
                newNode.layer =  Layers.Enum.UI_2D;;
                const sprite = newNode.addComponent(Sprite);
                sprite.spriteFrame = spriteFrame;
                newNode.getComponent(UITransform).setContentSize(400,400);
                this.PuzzleImageContainer.addChild(newNode);
                const eventHandler = new EventHandler();
                eventHandler.target = this.node; // The node where the script with the handler function is attached
                eventHandler.component = 'MainMenuManager'; // Must match this script class name
                eventHandler.handler = 'onImageSelected'; // Method name to call
                eventHandler.customEventData = '';
                newNode.addComponent(Button).clickEvents.push(eventHandler);
            });
        });
    }
    start() {
        
    }

    update(deltaTime: number) {
        
    }
    onImageSelected(event: Event,customEventData:String){
        const targetNode = event.target as unknown as Node;
        const selectedSpriteFrame = targetNode.getComponent(Sprite).spriteFrame;
        GameDataCenter.instance.PuzzleSprite = selectedSpriteFrame;
        this.PuzzleGridSelectionPage.active = true;
    }

    onGridSelectionPage(event: Event, customEventData: string){
        GameDataCenter.instance.PuzzleGridNumber = Number(customEventData)
        director.loadScene("GameplayScene")
    }
    onPlay(){
        // load images from directory
        // show images
        // click image
        // then show grid
        this.PuzzleImageSelectionPage.active = true;
    }
}

