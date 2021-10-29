import React from "react";

class UserRow extends React.Component {
    constructor(props) {
        super(props);
        this.editUser = this.editUser.bind(this);
        this.removeVenue = this.removeVenue.bind(this);
    }

    editUser() {
        this.props.handleEdit(this.props.item.id);  
    }

    removeVenue(id, index) {
        this.props.handleRemoveVenue(id, index);  
    }

    render() {
        return  (
        <tr key={this.props.item.id}>
            <td>{this.props.item.mail}</td>
            <td>
                {this.props.item.permissions.map((permission, index) =>
                    <button key={index} className={index%2==0? "hilton_button": "nh_button" }> {permission.venue.name} <i className="fa fa-times" onClick={() =>this.removeVenue(this.props.item.id, index)}></i></button>
                  )}
            </td>
            <td className="text-center">
                <img onClick={this.editUser} className="imgBox" src={require("assets/img/element/edit.png").default} alt="..."/>
            </td>
        </tr>);
    }
}

export default UserRow;
 