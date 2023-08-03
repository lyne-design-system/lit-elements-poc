
export class EventSpy {

    private _count : number = 0;
    public get count() : number {
        return this._count;
    }

    constructor(private _event: string, private _target: Node = null) {
        if (!this._target) {
            this._target = document;
        }
        this._listenForEvent();
    }

    private _listenForEvent() {
        this._target.addEventListener(this._event, () => this._count++)
    }
}