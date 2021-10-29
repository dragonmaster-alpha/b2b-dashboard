import React from "react";

class VenueRow extends React.Component {
    constructor(props) {
        super(props);
        this.editVenue = this.editVenue.bind(this);
        this.setOptions = this.setOptions.bind(this);
    }

    editVenue() {
        this.props.handleEdit(this.props.item.id);  
    }

    setOptions() {
        this.props.setOptions(this.props.item.id);
    }

    render() {
        return  (
        <tr key={this.props.item.id}>
            <td>{this.props.item.name}</td>
            <td>{this.props.item.company != null? this.props.item.company.name: ""}</td>
            <td>{this.props.item.domain}</td>
            <td>{this.props.item.sensorsCount}</td>
            <td>
                <img onClick={this.editVenue} className="imgBox" src={require("assets/img/element/edit.png").default} alt="..."/>
                <img onClick={this.setOptions} className="venueBox" src={require("assets/img/element/option.png").default} alt="..."/>
            </td>
        </tr>);
    }
}

export default VenueRow; 