import { AssetManager,assetManager,_decorator, Component, director, Node,resources,SpriteFrame,Sprite, Scene, UITransform, Layers, Button, EventHandler, Label, path, tween , screen, UIOpacity, Vec3, Widget ,} from 'cc';
import { GameDataCenter } from './GameDataCenter';
const { ccclass, property } = _decorator;

@ccclass('MainMenuManager')
export class MainMenuManager extends Component {

    @property(Node)
    private Home: Node = null;
    @property(Node)
    private PuzzleImageSelectionPage:Node = null;
    @property(Node)
    private PuzzleGridSelectionPage:Node = null;
    @property(Node)
    private PuzzleImageContainer:Node = null;
    @property(Node)
    private LoadingPage: Node = null;

    private ScreenWidth: number = 0;
    private ScreenHeigth: number = 0;
    
   
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
                    newNode.layer = Layers.Enum.UI_2D;;
                    const sprite = newNode.addComponent(Sprite);
                    sprite.spriteFrame = spriteFrame;
                    newNode.getComponent(UITransform).setContentSize(400, 500);
                    this.PuzzleImageContainer.addChild(newNode);
                    const eventHandler = new EventHandler();
                    eventHandler.target = this.node; // The node where the script with the handler function is attached
                    eventHandler.component = 'MainMenuManager'; // Must match this script class name
                    eventHandler.handler = 'onImageSelected'; // Method name to call
                    eventHandler.customEventData = '';
                    newNode.addComponent(Button).clickEvents.push(eventHandler);

                });
                this.scheduleOnce(() => {
                    this.FadeOutLoadPnl();
                    if (localStorage.getItem("GoToHome") == "2") {
                        //this.Home.active = false;
                        //this.PuzzleImageSelectionPage.active = true;
                        this.onplay();
                        localStorage.setItem("GoToHome", "0");

                    }

                }, 2)

            });
        
        
    }
    start() {

        // Get screen dimensions and multiply by 3
        this.ScreenHeight = screen.windowSize.height * 3; //

        // Move both pages off-screen to the right
        this.ScreenWidth = screen.windowSize.width * 3;

        this.PuzzleImageSelectionPage.getComponent(Widget).enabled = false;
        this.PuzzleGridSelectionPage.getComponent(Widget).enabled = false;

        this.scheduleOnce(() => {
            this.PuzzleImageSelectionPage.setPosition(new Vec3(this.ScreenWidth, 0, 0));
            this.PuzzleGridSelectionPage.setPosition(new Vec3(this.ScreenWidth, 0, 0));
        }, 0);

        this.PuzzleImageSelectionPage.getComponent(Widget).enabled = true;
        this.PuzzleGridSelectionPage.getComponent(Widget).enabled = true;
        console.log(`Screen Width x3: ${this.ScreenWidth}, Screen Height x3: ${this.ScreenHeight}`);
    }


    update(deltaTime: number) {
        
    }
    onImageSelected(event: Event,customEventData:String){
        const targetNode = event.target as unknown as Node;
        const selectedSpriteFrame = targetNode.getComponent(Sprite).spriteFrame;
        GameDataCenter.instance.PuzzleSprite = selectedSpriteFrame;
        //this.PuzzleGridSelectionPage.active = true;

        tween(this.PuzzleGridSelectionPage)
            .to(0.5, { position: new Vec3(0, 0, 0) })
            .start();

        tween(this.PuzzleImageSelectionPage)
            .to(0.5, { position: new Vec3(-1 * this.ScreenWidth, 0, 0) })
            .start();

    }

    onGridSelectionPage(event: Event, customEventData: string){
        console.log("number gird "+Number(customEventData));

        GameDataCenter.instance.PuzzleGridNumber = Number(customEventData)
        director.loadScene("GameplayScene")
    }
    onPlay(){
        //this.PuzzleImageSelectionPage.active = true;
        tween(this.Home)
             .to(0.5, { position: new Vec3(-1 * this.ScreenWidth, 0, 0) })
             .start();
        
        tween(this.PuzzleImageSelectionPage)
             .to(0.5, { position: new Vec3(0, 0, 0) })
             .start();
        
    }

    BackBtnImages() {
        //this.PuzzleImageSelectionPage.active = false;

        tween(this.Home)
             .to(0.5, { position: new Vec3(0, 0, 0) })
             .start();
        
        tween(this.PuzzleImageSelectionPage)
             .to(0.5, { position: new Vec3(this.ScreenWidth, 0, 0) })
             .start();
        
    }

    BackBtnPieces() {
        //this.PuzzleGridSelectionPage.active = false;
        //this.PuzzleImageSelectionPage.active = true;


        tween(this.PuzzleGridSelectionPage)
             .to(0.5, { position: new Vec3(this.ScreenWidth, 0, 0) })
             .start();
        
        tween(this.PuzzleImageSelectionPage)
             .to(0.5, { position: new Vec3(0, 0, 0) })
             .start();
        
    }

    FadeOutLoadPnl() {
        const opacity = this.LoadingPage.getComponent(UIOpacity)
        tween(opacity)
            .to(0.5, { opacity: 0 })
            .start();
        
    }

    //FadeInLoadPnl() {
    //    const opacity = this.LoadingPage.getComponent(UIOpacity)
    //    tween(opacity){
    //        .to(0.25, { opacity: 255 })
    //        .start();
    //    }
    //}
}

