import { ReactiveController, ReactiveControllerHost } from "lit";


export class TestController implements ReactiveController {
    private host: ReactiveControllerHost;

    constructor(host: ReactiveControllerHost) {
        // Store a reference to the host
        this.host = host;

        // console.log(this.host);
        
        // Register for lifecycle updates
        host.addController(this);
    }

    hostConnected(): void {
        
    }

    hostDisconnected(): void {

    }
   
    hostUpdate?(): void {
        // Before the host update
    }

    hostUpdated?(): void {
        // After the host update
    }
    
}

