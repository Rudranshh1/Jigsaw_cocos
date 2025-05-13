import { _decorator, Component, Node, Prefab,instantiate, Vec3, UITransform, BoxCollider2D } from 'cc';
import { PieceManager } from './PieceManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(Prefab)
    private piecePrefab_12:Prefab = null
    @property(Node)
    private ScrollArea:Node = null;
    @property(Prefab)
    private PieceHolder:Prefab = null;
    private CorrectPosition:[] = null;
    
    private PieceArray:Node[];
    @property(Node)
    private Container:Node= null;
    // first initialize piecePrefab 
    // desctruce piece into scroll area
     PieceHeader=null;
    protected onLoad(): void {
         this.PieceHeader = instantiate(this.piecePrefab_12);
        this.node.addChild(this.PieceHeader)
        console.log(this.PieceHeader.children.length)
        let count = 0;
        for(let i =this.PieceHeader.children.length-1;i>=0;i--){
            const pieceHolder = instantiate(this.PieceHolder);
            this.PieceHeader.children[i].children[0].getComponent(PieceManager).Container = this.Container;
            this.ScrollArea.addChild(pieceHolder);
            const size = this.PieceHeader.children[i].children[0].getComponent(UITransform).contentSize;
            pieceHolder.getComponent(UITransform).setContentSize(size);
            const pieceManager = this.PieceHeader.children[i].children[0].getComponent(PieceManager);
            pieceManager.PieceHolder = pieceHolder;
            
        }
        console.log(count);
    }

    start() {
        setTimeout(()=>{
            for(let i =this.PieceHeader.children.length-1;i>=0;i--){
                
                this.PieceHeader.children[i].children[0].setScale(0.5,0.5);
                this.PieceHeader.children[i].children[0].getComponent(PieceManager).setPiecePosition();
                this.PieceHeader.children[i].children[0].getComponent(BoxCollider2D).enabled = true;
                
                
        }
        },100)
        let index = 0;
        for(let i = 0;i<this.PieceHeader.children.length;i++)
        {
           
        }
        
    }

    FadeEveryPiece(){

    }


    update(deltaTime: number) {
        
    }
}





