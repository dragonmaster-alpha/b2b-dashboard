import React from "react";

class CompanyRow extends React.Component {
    constructor(props) {
        super(props);
        this.editCompany = this.editCompany.bind(this);

    }

    editCompany() {
        this.props.handleEdit(this.props.item.id);  
    }

    render() {
        return  (
        <tr key={this.props.item.id}>
            <td>{this.props.item.name}</td>
            <td>{this.props.item.street}</td>
            <td>{this.props.item.postalCode}</td>
            <td>{this.props.item.city}</td>
            <td>{this.props.item.country}</td>
            <td>{this.props.item.vat}</td>
            <td>{this.props.item.phone}</td>
            <td>{this.props.item.mail}</td>
            <td><img className="imgBox" src={require("assets/img/element/edit.png").default} alt="..." onClick={this.editCompany}/></td>
        </tr>);
    }
}

export default CompanyRow; 
