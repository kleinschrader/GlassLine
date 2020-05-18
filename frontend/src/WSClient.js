import config from './config.json'

class WSClient_Request extends EventTarget {
    seq = null
}

class WSClient extends EventTarget {
    constructor(props) {
        super(props)

        this.onMessage = this.onMessage.bind(this)
        this.onOpen = this.onOpen.bind(this)
        this.onClose = this.onClose.bind(this)

        this.socket = new WebSocket(config.server, "glasslinews")
        this.socket.addEventListener('open',this.onOpen)
        this.socket.addEventListener('message',this.onMessage)
        this.socket.addEventListener('close',this.onClose)
    }

    onOpen() {
        let event = new CustomEvent('open')
        this.dispatchEvent(event)
    }

    onClose() {
        let event = new CustomEvent('close')
        this.dispatchEvent(event)
    }

    onMessage(rawdata) {

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
            this.openRequests.splice(responseIndex,1)
        } 
    }

    genSeq() {
        return Math.floor(Math.random() * 65000);
    }

    getSetupRequired() {
        let requestObj = {};
        requestObj.cmd = 'getSetupRequired';
        requestObj.seq = this.genSeq();

        let retObj = new WSClient_Request()
        retObj.seq = requestObj.seq
        this.openRequests.push(retObj) 

        this.socket.send(JSON.stringify(requestObj))

        return retObj;
    }

    checkSetupToken(token) {
        let requestObj = {};
        requestObj.cmd = 'checkSetupToken';
        requestObj.seq = this.genSeq();
        requestObj.token = token;

        let retObj = new WSClient_Request()
        retObj.seq = requestObj.seq
        this.openRequests.push(retObj) 

        this.socket.send(JSON.stringify(requestObj))

        return retObj;
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

    getTenants() {
        let requestObj = {}
        requestObj.cmd = 'getTenants';
        requestObj.seq = this.genSeq();

        let retObj = new WSClient_Request()
        retObj.seq = requestObj.seq
        this.openRequests.push(retObj) 

        this.socket.send(JSON.stringify(requestObj))
        return retObj;
    }

    getTenantServer(tenant) {
        let requestObj = {}
        requestObj.cmd = 'getTenantServer';
        requestObj.tenant = tenant
        requestObj.seq = this.genSeq();

        let retObj = new WSClient_Request()
        retObj.seq = requestObj.seq
        this.openRequests.push(retObj) 

        this.socket.send(JSON.stringify(requestObj))
        return retObj;
    }

    checkTenantAdmin() {
        let requestObj = {}
        requestObj.cmd = 'checkTenantAdmin';
        requestObj.seq = this.genSeq();

        let retObj = new WSClient_Request()
        retObj.seq = requestObj.seq
        this.openRequests.push(retObj) 

        this.socket.send(JSON.stringify(requestObj))
        return retObj;
    }

    createServer(servername, tenant, parent) {
        let requestObj = {};
        requestObj.cmd = 'createServer';
        requestObj.seq = this.genSeq();
        requestObj.servername = servername
        requestObj.tenant = tenant
        requestObj.parent = parent

        this.socket.send(JSON.stringify(requestObj))
    }

    getAllServers() {
        let requestObj = {}
        requestObj.cmd = 'getAllServers'
        requestObj.seq = this.genSeq()

        let retObj = new WSClient_Request()
        retObj.seq = requestObj.seq
        this.openRequests.push(retObj) 

        this.socket.send(JSON.stringify(requestObj))
        return retObj;
    }

    createTenant(tenantname, useMFA, globalAdmin) {
        let requestObj = {}
        requestObj.cmd = 'createTenant'
        requestObj.seq = this.genSeq()
        requestObj.tenantname = tenantname
        requestObj.useMFA = useMFA
        requestObj.globalAdmin = globalAdmin

        let retObj = new WSClient_Request()
        retObj.seq = requestObj.seq
        this.openRequests.push(retObj) 

        this.socket.send(JSON.stringify(requestObj))
        return retObj;
    }

    createUser(username,password,tenant,tenantAdmin) {
        let requestObj = {}
        requestObj.cmd = 'createUser'
        requestObj.seq = this.genSeq()
        requestObj.username = username
        requestObj.password = password
        requestObj.tenant = tenant
        requestObj.tenantAdmin = tenantAdmin

        let retObj = new WSClient_Request()
        retObj.seq = requestObj.seq
        this.openRequests.push(retObj) 

        this.socket.send(JSON.stringify(requestObj))
        return retObj;
    }

    generateMFASecret() {
        let requestObj = {}
        requestObj.cmd = 'generateMFASecret'
        requestObj.seq = this.genSeq()

        let retObj = new WSClient_Request()
        retObj.seq = requestObj.seq
        this.openRequests.push(retObj) 

        this.socket.send(JSON.stringify(requestObj))
        return retObj;
    }

    finishSetup() {
        let requestObj = {}
        requestObj.cmd = 'finishSetup'
        requestObj.seq = this.genSeq()
        
        this.socket.send(JSON.stringify(requestObj))
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