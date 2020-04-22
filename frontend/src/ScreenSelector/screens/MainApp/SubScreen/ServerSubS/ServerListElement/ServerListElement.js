import React from 'react'

class ServerListElement extends React.Component {
    handleEditButton() {
        
    }
    
    
    handleDeleteButton() {

    }
    
    render() {
        return(
            <tr>
                <td>{this.props.servername}</td>
                <td>{this.props.tenantname}</td>
                <td>
                    <button onClick={this.handleEditButton}><i class="far fa-edit"></i></button>
                    <button onClick={this.handleDeleteButton}><i class="far fa-trash-alt"></i></button>
                </td>
            </tr>
        )
    }
}

export default ServerListElement