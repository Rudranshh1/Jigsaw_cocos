import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LoadingText')
export class LoadingText extends Component {

    protected onLoad(): void {
        let loadingText = this.getComponent(Label);
        let arr = [".","..","...","...."];
            let i = 0;
            this.schedule(()=>{
                if(i>3)
                    i = 0;
                loadingText.string = "Loading"+arr[i];
                i++;
            },0.5)
    }
    start() {

    }

    update(deltaTime: number) {
        
    }
}

