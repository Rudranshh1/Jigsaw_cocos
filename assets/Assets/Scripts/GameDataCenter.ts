import { _decorator,director, Component,Sprite, Node, Game, SpriteFrame, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameDataCenter')
export class GameDataCenter extends Component {
    public static instance:GameDataCenter;
    @property(SpriteFrame)
    public PuzzleSprite:SpriteFrame = null;
    @property(Number)
    public PuzzleGridNumber:Number = 0;
    @property(Prefab)
    public Pieces12:Prefab;
    @property(Prefab)
    public Pieces42:Prefab;
    @property(Prefab)
    public Pieces63:Prefab;
    @property(Prefab)
    public Pieces99:Prefab;
    @property(Prefab)
    public Piece120:Prefab;
    @property(Prefab)
    public Piece168:Prefab;
    protected onLoad(): void {
        director.addPersistRootNode(this.node);
        if(GameDataCenter.instance == null)
            GameDataCenter.instance = this;
        else{
            GameDataCenter.instance.destroy();
            GameDataCenter.instance = this;
        }
    }
    public getScale(){
        if(this.PuzzleGridNumber == 12)
            return 0.5;
        else if(this.PuzzleGridNumber == 42)
            return 0.5;
        else if(this.PuzzleGridNumber == 63)
            return 1;
        else if(this.PuzzleGridNumber == 99)
            return 1.2;
        else if(this.PuzzleGridNumber == 120)
            return 1.2;
        else if(this.PuzzleGridNumber == 168)
            return 1.2;
    }
    public getPrefab(){
        if(this.PuzzleGridNumber == 12)
            return this.Pieces12;
        else if(this.PuzzleGridNumber == 42)
            return this.Pieces42;
        else if(this.PuzzleGridNumber == 63)
            return this.Pieces63;
        else if(this.PuzzleGridNumber == 99)
            return this.Pieces99
        else if(this.PuzzleGridNumber == 120)
            return this.Piece120;
        else if(this.PuzzleGridNumber == 168)
            return this.Piece168;
    }
    public getLength(){
        if(this.PuzzleGridNumber == 12)
            return 4;
        if(this.PuzzleGridNumber == 42)
            return 7;
        if(this.PuzzleGridNumber == 63)
            return 9;
        if(this.PuzzleGridNumber == 99)
            return 11;
        if(this.PuzzleGridNumber == 120)
            return 12;
        if(this.PuzzleGridNumber == 168)
            return 14;
    }
    public getWidht(){
        if(this.PuzzleGridNumber == 12)
            return 3;
        if(this.PuzzleGridNumber == 42)
            return 6;
        if(this.PuzzleGridNumber == 63)
            return 7;
        if(this.PuzzleGridNumber == 99)
            return 9;
        if(this.PuzzleGridNumber == 120)
            return 10;
        if(this.PuzzleGridNumber == 168)
            return 12;
    }

    public winCount(){
        return this.PuzzleGridNumber;
    }
}

