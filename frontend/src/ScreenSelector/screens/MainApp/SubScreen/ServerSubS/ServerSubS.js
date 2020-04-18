import React from 'react'

import './ServerSubS.css'

class ServerSubS extends React.Component {
    constructor(props) {
        super(props)
        this.handleTenantCallback = this.handleTenantCallback.bind(this)
        this.handleTenantChange = this.handleTenantChange.bind(this)
        this.handleServerCallback = this.handleServerCallback.bind(this)
    }

    componentDidMount() {
        let request = document.WSClient.getTenants()
        request.addEventListener('complete',this.handleTenantCallback)
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

    handleSubmit (e) {
        e.preventDefault();

        console.log(e.target.servername.value)

        document.WSClient.createServer(e.target.servername.value, e.target.tenant.value , e.target.parent.value)
    }

    state = {
        tenants : [],
        parents : [],
        setTenant : ""
    }

    render() {
        const tenantOptions = this.state.tenants.map((elem) => 
        <option key={elem.id} value={elem.id}>{elem.name}</option>
        );
        const serverOptions = this.state.parents.map((elem) => 
        <option key={elem.id} value={elem.id}>{elem.name}</option>
        );
        return (
            <div className="ServerSubS SubScreen">
                <form className="CreateServerForm" onSubmit={this.handleSubmit}>
                    <h3>Create Server</h3>
                    <label htmlFor="input_servername">Servername</label>
                    <input maxLength="64" id="input_servername" name="servername"></input>
                    <div className="DualInputSplitter">
                        <div>
                            <label for="input_tenant">Tenant</label>
                            <select id="input_tenant" defaultValue="NONE" name="tenant" onChange={this.handleTenantChange}>
                                <option value="NONE" hidden disabled >Select Tenant</option>
                                {tenantOptions}
                            </select>
                        </div>
                        <div>
                            <label for="input_parent">Parent Server</label>
                            <select id="input_parent" defaultValue="00000000-0000-0000-0000-000000000000" name="parent" disabled={this.state.setTenant === ""}>
                                <option value="00000000-0000-0000-0000-000000000000" >Kein Parent Server</option>
                                {serverOptions}
                            </select>
                        </div>
                    </div>
                    <input type="submit" value="Create Server"/>
                </form>
            </div>
        )
    }
}

export default ServerSubS;