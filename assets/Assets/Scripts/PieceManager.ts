import { _decorator,UIOpacity ,Sprite ,Color,tween, Component,EventTouch, Node,UITransform, Vec2,Input,Vec3 , Contact2DType, Collider2D, IPhysics2DContact ,PhysicsSystem2D, color, Vec4, Game} from 'cc';
import { GameManager } from './GameManager';
import { GameDataCenter } from './GameDataCenter';
const { ccclass, property } = _decorator;

@ccclass('PieceManager')
export class PieceManager extends Component {
    // public static instance: PieceManager = null;
    private offset = new Vec3();
    private canMove = true;
    private inPuzzleContainer = false;
    @property(Number)
    public GirdI:number=0;
    @property(Number)
    public GridJ:number=0;
    @property(Node)
    private Container:Node= null;
    @property(Node)
    public PieceHolder:Node = null;
    public PieceSet = false;
    @property(Boolean)
    private isDragging:boolean = false;
    private uiTransform:UITransform;
    private worldBounds = null;
    private GameStart = false;
    private getout = false;
    @property(Boolean)
    public isCorner = false;
     onLoad() {
   
        PhysicsSystem2D.instance.enable = true;
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this); // optional

    }
    
    onTouchStart(event: EventTouch) {
        this.isDragging = true;
        const touchPos = event.getUILocation();
        this.node.getParent().setSiblingIndex(999);
        const worldPos = new Vec3(touchPos.x, touchPos.y, 0);
        const localPos = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(worldPos);

        const currentPos = this.node.getPosition();
        this.offset = new Vec3(currentPos.x - localPos.x, currentPos.y - localPos.y, 0);
    }

    onTouchMove(event: EventTouch) {
        if (!this.isDragging || !this.canMove) return;
        const touchPos = event.getUILocation();
        const worldPos = new Vec3(touchPos.x, touchPos.y, 0);
        const localPos = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(worldPos);

        this.node.setPosition(localPos.x + this.offset.x, localPos.y + this.offset.y, 0);
        
        // this.checkSnap();
    }

    onTouchEnd(event: EventTouch) {
        this.isDragging = false;
        this.checkSnap();
    }

    checkSnap(){
        if(this.PieceSet)
            return
        let position = this.node.getPosition();
        if(position.x>-40 && position.y>-40 && position.x<40 && position.y<40)
        {
            this.node.setPosition(0,0);
            this.PieceSet = true;
            this.canMove = false;
            this.PieceHolder.active = false;
            // this.fadeToDarkAndBack();
            this.fadePieces();
            GameManager.instance.CheckComplete();
            this.node.getParent().setSiblingIndex(0);

            
        }
    }
    fadeToDarkAndBack() {
    
    const startColor = this.node.getComponent(Sprite).color.clone();

        // Target color
        const targetColor = new Color(100, 100, 100, 255);

        // Tween color
        tween({ r: startColor.r, g: startColor.g, b: startColor.b, a: startColor.a })
            .to(0.35, { r: targetColor.r, g: targetColor.g, b: targetColor.b, a: targetColor.a }, {
                onUpdate: (val) => {
                    this.node.children[0].getComponent(Sprite).color = new Color(val.r, val.g, val.b, val.a);
                    
                }
            })
            .to(0.35, { r: startColor.r, g: startColor.g, b: startColor.b, a: startColor.a }, {
                onUpdate: (val) => {
                    this.node.children[0].getComponent(Sprite).color = new Color(val.r, val.g, val.b, val.a);
                    
                }
            })
            .start();
    }
    setPiecePosition(){
        
        const newPosition = this.PieceHolder.worldPosition // New position for the node (x, y, z)
        tween(this.node)
        .to(0.2, { worldPosition: newPosition }, { easing: 'sineOut' }) // 0.5 seconds, with easing
        .start();
        
    }
    setScrollPosition(){
        
        const newPosition = this.PieceHolder.worldPosition // New position for the node (x, y, z)
        this.node.setWorldPosition(newPosition);

    }
    protected start(): void {
         
        this.uiTransform = this.Container.getComponent(UITransform);
        this.worldBounds = this.uiTransform.getBoundingBoxToWorld();
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onTriggerEnter, this);
            collider.on(Contact2DType.END_CONTACT, this.onTriggerExit, this);
        }
    }

    update(deltaTime: number) {
        if(!this.isDragging && this.canMove && !this.inPuzzleContainer){
            this.setScrollPosition();
        }
        if(this.getout && !this.isDragging )
        {
           
            this.setPiecePosition();
            this.inPuzzleContainer = false;
            this.node.setScale(GameDataCenter.instance.getScale(), GameDataCenter.instance.getScale())
            this.PieceHolder.active = true;
            this.getout = false;
            
        }
    }

    fadePieces(){
        GameManager.instance.FadePiecesBFS([this.GirdI,this.GridJ]);
    }

    onTriggerEnter(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if(otherCollider.node.name =='BG')
        {
            this.inPuzzleContainer = true;
            this.node.setScale(1,1)
            this.PieceHolder.active = false;
            this.getout = false;
        }
    }

    onTriggerExit(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if(otherCollider.node.name =='BG')
        {
            this.getout = true;
        }
        
    }

   
    
  
    
    
}


