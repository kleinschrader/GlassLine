import React from 'react'

import './ServerSubS.css'

class ServerSubS extends React.Component {
    constructor(props) {
        super(props)
        this.handleTenantCallback = this.handleTenantCallback.bind(this)
        this.handleTenantChange = this.handleTenantChange.bind(this)
        this.handleServerCallback = this.handleServerCallback.bind(this)
        this.handleServerListCallback = this.handleServerListCallback.bind(this)
    }

    componentDidMount() {
        let tenantRequest = document.WSClient.getTenants()
        tenantRequest.addEventListener('complete',this.handleTenantCallback)

        let serverlistRequest = document.WSClient.getAllServers()
        serverlistRequest.addEventListener('complete',this.handleServerListCallback)
    }
    
    handleTenantCallback(r) {
        this.setState({tenants : r.detail.data.tenants})
    }

    handleTenantChange(e) {
        this.setState({setTenant : e.target.value})
        let resp = document.WSClient.getTenantServer(e.target.value)
        resp.addEventListener('complete',this.handleServerCallback)
    }

    handleServerCallback(r) {
        if(r.detail.data.server === false || r.detail.data.server === []) {
            return;
        }

        this.setState({parents : r.detail.data.server})
    }

    handleServerListCallback(r) {
        this.setState({serverList : r.detail.data.server})
    }

    handleSubmit (e) {
        e.preventDefault();

        console.log(e.target.servername.value)

        document.WSClient.createServer(e.target.servername.value, e.target.tenant.value , e.target.parent.value)
    }

    state = {
        tenants : [],
        parents : [],
        serverList : [],
        adminTenant : false,
        setTenant : ""
    }

    render() {
        const tenantOptions = this.state.tenants.map((elem) => 
        <option key={elem.id} value={elem.id}>{elem.name}</option>
        );
        const serverOptions = this.state.parents.map((elem) => 
        <option key={elem.id} value={elem.id}>{elem.name}</option>
        );
        const serverList = this.state.serverList.map((elem) => 
        <tr>
            <td>{elem.servername}</td>
            <td>{elem.tenantname}</td>
        </tr>
        );
        return (
            <div className="ServerSubS SubScreen">
                <form className="CreateServerForm" onSubmit={this.handleSubmit}>
                    <h3>Create Server</h3>
                    <label htmlFor="input_servername">Servername</label>
                    <input maxLength="64" id="input_servername" name="servername"></input>
                    <div className="DualInputSplitter">
                        <div>
                            <label htmlFor="input_tenant">Tenant</label>
                            <select id="input_tenant" defaultValue="NONE" name="tenant" onChange={this.handleTenantChange}>
                                <option value="NONE" hidden disabled >Select Tenant</option>
                                {tenantOptions}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="input_parent">Parent Server</label>
                            <select id="input_parent" defaultValue="00000000-0000-0000-0000-000000000000" name="parent" disabled={this.state.setTenant === ""}>
                                <option value="00000000-0000-0000-0000-000000000000" >Kein Parent Server</option>
                                {serverOptions}
                            </select>
                        </div>
                    </div>
                    <input type="submit" value="Create Server"/>
                </form>
                <div className="ServerListBlock">
                    <h3>Serverlist</h3>
                    <label htmlFor="input_serverlisttenant" >Filter by Tenant</label>
                    <select id="input_serverlisttenant" defaultValue="00000000-0000-0000-0000-000000000000">
                        <option value="00000000-0000-0000-0000-000000000000"> Dont Filter</option>
                        {tenantOptions}
                    </select>
                    <table className="ServerListTable">
                        <tr>
                            <th>Servername</th>
                            <th>Tenant</th>
                        </tr>
                        {serverList}
                    </table>
                </div>
            </div>
        )
    }
}

export default ServerSubS;