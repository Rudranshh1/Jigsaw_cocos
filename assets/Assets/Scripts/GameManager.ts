import { _decorator, Component, Node, Prefab,instantiate, Vec3, UITransform, BoxCollider2D, Game, random,Vec2, Sprite, director} from 'cc';
import { PieceManager } from './PieceManager';
import { RandomNumberGenerator } from './RandomNumberGenerator';
import { GameDataCenter } from './GameDataCenter';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    private  rng:RandomNumberGenerator;
    public static instance:GameManager = null;
    @property(Prefab)
    private piecePrefab_12:Prefab = null
    @property(Node)
    private ScrollArea:Node = null;
    @property(Prefab)
    private PieceHolder:Prefab = null;
    private grid:Node[][] = null;
    @property(Node)
    private Container:Node= null;
    private CornverViewToggle:Boolean= true;
    private TotalPieceSet:number = 0;
    @property(Node)
    private ExitPage:Node = null;
    @property(Node)
    private PuzzleSprite:Node = null;
    PieceHeader=null;
    private showSpriteToggle = false;
    protected onLoad(): void {
        GameManager.instance = this;
        this.piecePrefab_12 = GameDataCenter.instance.getPrefab();
        this.PieceHeader = instantiate(this.piecePrefab_12);
        this.node.addChild(this.PieceHeader)
        console.log(this.PieceHeader.children.length)
        let count = 0;
        this.AssignPieceContainer();
    }

    start() {
        this.grid = new Array(GameDataCenter.instance.getLength()).fill(null).map(() => new Array(GameDataCenter.instance.getWidht()).fill(null));
        this.SetPiecePositionToContainer();
    }
    AssignPieceContainer(){
        for(let i =this.PieceHeader.children.length-1;i>=0;i--){
            const pieceHolder = instantiate(this.PieceHolder);
            pieceHolder.name = 'PieceHolder_'+i;
            this.PieceHeader.children[i].children[0].children[0].getComponent(Sprite).spriteFrame = GameDataCenter.instance.PuzzleSprite;
            this.PieceHeader.children[i].children[0].getComponent(PieceManager).Container = this.Container;
            this.ScrollArea.addChild(pieceHolder);
            const size = this.PieceHeader.children[i].children[0].getComponent(UITransform).contentSize;
            pieceHolder.getComponent(UITransform).setContentSize(300,300);
            const pieceManager = this.PieceHeader.children[i].children[0].getComponent(PieceManager);
            pieceManager.PieceHolder = pieceHolder;
            
        }
    }
    SetPiecePositionToContainer(){
        setTimeout(()=>{
            for(let i =this.PieceHeader.children.length-1;i>=0;i--){
                
                this.PieceHeader.children[i].children[0].setScale(GameDataCenter.instance.getScale(),GameDataCenter.instance.getScale());
                this.PieceHeader.children[i].children[0].getComponent(PieceManager).setPiecePosition();
                this.PieceHeader.children[i].children[0].getComponent(BoxCollider2D).enabled = true;
            }
            this.setPieceGrid();
            this.ShufflePiecePosition();
        },100)
    }
    ShufflePiecePosition(){
        this.rng = new RandomNumberGenerator(GameDataCenter.instance.PuzzleGridNumber);
        for(let i =0;i<this.ScrollArea.children.length;i++)
        {
            const j = this.rng.getNext();
            this.ScrollArea.insertChild(this.ScrollArea.children[i], j);

        }
        
    }
    setPieceGrid(){
        let pieceIndex = 0;
        for(let i =0;i<GameDataCenter.instance.getLength();i++){
            for(let j = 0;j<GameDataCenter.instance.getWidht();j++){
                // corner piece 
                if((i==0 && j==0) || (i==0 && j==this.grid[0].length-1) || (i==this.grid.length-1 && j==0) || (i== this.grid.length-1 && j==this.grid[0].length-1))
                    this.PieceHeader.children[pieceIndex].children[0].getComponent(PieceManager).isCorner = true;
                this.PieceHeader.children[pieceIndex].children[0].getComponent(PieceManager).GirdI = i;
                this.PieceHeader.children[pieceIndex].children[0].getComponent(PieceManager).GridJ = j;
                this.grid[i][j] = this.PieceHeader.children[pieceIndex].children[0];
                console.log("node name "+this.grid[i][j].name);
                pieceIndex++;
            }
        }
    }

    FadePiecesBFS(index){
        let rows = this.grid.length;
        let cols = this.grid[0].length;
        const queue: [number, number][] = [];
        const visited = Array.from({ length: this.grid.length }, () => Array(this.grid[0].length).fill(false));
        const directions = [
            [0, 1],  // right
            [1, 0],  // down
            [0, -1], // left
            [-1, 0]  // up
          ];
        queue.push(index);
        visited[index[0]][index[1]] = true;
        while (queue.length > 0) {
            const [x, y] = queue.shift()!;
            this.grid[x][y].getComponent(PieceManager).fadeToDarkAndBack();
            for (const [dx, dy] of directions) {
                const newX = x + dx;
                const newY = y + dy;
        
                if (newX >= 0 && newX < rows && newY >= 0 && newY < cols && !visited[newX][newY] && this.grid[newX][newY].getComponent(PieceManager).PieceSet ) 
                {
                    visited[newX][newY] = true;
                    
                    queue.push([newX, newY]);
                }
            }
          }
    }
    DisplayCornerPieces(){
        for(let i=0;i<GameDataCenter.instance.getLength();i++){
            for(let j=0;j<GameDataCenter.instance.getWidht();j++){
                let isCorner = this.grid[i][j].getComponent(PieceManager).isCorner;
                let PieceSet = this.grid[i][j].getComponent(PieceManager).PieceSet;
                if(this.CornverViewToggle)
                {
                    if(!isCorner && !PieceSet){
                        this.grid[i][j].getComponent(PieceManager).PieceHolder.active = false;
                        this.grid[i][j].active = false;
                    }
                    
                }
                else{
                    if(!PieceSet){
                        this.grid[i][j].getComponent(PieceManager).PieceHolder.active = true;
                        this.grid[i][j].active = true;
                    }
                }
            }
        }
        this.CornverViewToggle = !this.CornverViewToggle
    }
    

    CheckComplete(){
        this.TotalPieceSet++;
        if(this.TotalPieceSet ==GameDataCenter.instance.winCount())
        {
            console.log('puzzle Completed')
        }
    }

    ShowPuzzleSprite(){
        if(!this.showSpriteToggle){
            this.PuzzleSprite.getComponent(Sprite).spriteFrame = GameDataCenter.instance.PuzzleSprite;
            this.PuzzleSprite.active = true;
            this.PuzzleSprite.setSiblingIndex(999);
        }
        else{
            this.PuzzleSprite.active = false;
        }
        this.showSpriteToggle = !this.showSpriteToggle
    }

    OnClickExitPage(){
        this.ExitPage.active = true;
        this.ExitPage.setSiblingIndex(999);
    }
    ResumeGame(){
        this.ExitPage.active = false;
    }
    ReturnToHome(){
        director.loadScene('HomeScene');
    }
    RestartGame(){
        director.loadScene('GameplayScene')
    }
}





