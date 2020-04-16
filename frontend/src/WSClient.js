import config from './config.json'

class WSClient_Request extends EventTarget {
    seq = null
}

class WSClient extends EventTarget {
    constructor(props) {
        super(props)

        this.onMessgage = this.onMessgage.bind(this)
        this.onOpen = this.onOpen.bind(this)
        this.keepAlive = this.keepAlive.bind(this)
        this.onClose = this.onClose.bind(this)

        this.socket = new WebSocket(config.server, "glasslinews")
        this.socket.addEventListener('open',this.onOpen)
        this.socket.addEventListener('message',this.onMessgage)
        this.socket.addEventListener('close',this.onClose)
    }

    onOpen() {
        setInterval(this.keepAlive,15000)

        let event = new CustomEvent('open')
        this.dispatchEvent(event)
    }

    onClose() {
        let event = new CustomEvent('close')
        this.dispatchEvent(event)
    }

    keepAlive() {
        this.socket.send("")
    }

    onMessgage(rawdata) {
        let data = JSON.parse(rawdata.data)

        let responseIndex = null;

        for(let i = 0; i < this.openRequests.length; i++) {
            if(this.openRequests[i].seq === data.seq)
            {
                responseIndex = i
            }
        }

        if(responseIndex !== null)
        {
            let event = new CustomEvent('complete', {
                detail: {
                    data
                }
            })

            this.openRequests[responseIndex].dispatchEvent(event)
        }

        this.openRequests.splice(responseIndex)
    }

    genSeq() {
        return Math.floor(Math.random() * 65000);
    }

    checkTokenLogin(token) {
        let requestObj = {};
        requestObj.cmd = 'checkTokenLogin';
        requestObj.seq = this.genSeq();
        requestObj.token = token;

        let retObj = new WSClient_Request()
        retObj.seq = requestObj.seq
        this.openRequests.push(retObj) 

        this.socket.send(JSON.stringify(requestObj))

        return retObj;
    }

    checkCredLogin(username,password,keepLoggedIn) {
        let requestObj = {};
        requestObj.cmd = 'checkCredLogin';
        requestObj.seq = this.genSeq();
        requestObj.username = username;
        requestObj.password = password;
        requestObj.keepLoggedIn = keepLoggedIn;

        let retObj = new WSClient_Request()
        retObj.seq = requestObj.seq
        this.openRequests.push(retObj) 

        this.socket.send(JSON.stringify(requestObj))

        return retObj;
    }

    logoff() {
        let requestObj = {};
        requestObj.cmd = 'logoff';
        requestObj.seq = this.genSeq();

        this.socket.send(JSON.stringify(requestObj))
    }

    socket = null
    openRequests = []
}

export default WSClient;