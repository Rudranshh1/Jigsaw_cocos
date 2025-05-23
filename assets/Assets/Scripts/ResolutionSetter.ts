import { _decorator, Component, Node,screen,UITransform,view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ResolutionSetter')
export class ResolutionSetter extends Component {
    start() {
        view.setDesignResolutionSize(screen.windowSize.width, screen.windowSize.height, 0);
    }

    update(deltaTime: number) {
        
    }
}

