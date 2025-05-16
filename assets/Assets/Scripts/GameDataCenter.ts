import { _decorator,director, Component,Sprite, Node, Game, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameDataCenter')
export class GameDataCenter extends Component {
    public static instance:GameDataCenter;
    @property(SpriteFrame)
    public PuzzleSprite:SpriteFrame = null;
    @property(Number)
    public PuzzleGridNumber:Number = 0;


    protected onLoad(): void {
        director.addPersistRootNode(this.node);
        if(GameDataCenter.instance == null)
            GameDataCenter.instance = this;
        else{
            GameDataCenter.instance.destroy();
            GameDataCenter.instance = this;
        }
    }
}

