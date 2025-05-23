import { _decorator, Component, Node,screen } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIElementResSetter')
export class UIElementResSetter extends Component {

    start() {
        this.setElementScale();
    }
    setElementScale(){
        const designWidth = 1080;
        const designHeight = 1920;
        const screenSize = screen.windowSize;
        const scaleX = screenSize.width / designWidth;
        const scaleY = screenSize.height / designHeight;
        const scale = Math.min(scaleX, scaleY);
        this.node.setScale(scale,scale);
    }
    update(deltaTime: number) {
        //this.setElementScale();
    }
}

