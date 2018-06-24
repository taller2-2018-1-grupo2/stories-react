import React, { Component } from "react";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import axios from 'axios'

const SHARED_SERVER_URI = "https://shared-server-stories.herokuapp.com/api"


export default class ServerTable extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
        servers: []
    };

    this.customConfirm = this.customConfirm.bind(this);
    this.onAddRow = this.onAddRow.bind(this);
    this.onBeforeSaveCell = this.onBeforeSaveCell.bind(this);
  }

  async componentDidMount(){
    //console.log(this.props.childProps.token.token)
    const setServers = mServers => this.setState({servers: mServers});

    await axios({
      method:'get',
      url: SHARED_SERVER_URI + '/servers',
      headers: {'Authorization': 'Bearer ' + this.props.childProps.token.token}
      })
        .then(function(response) {
          console.log(response)

          response.data.servers.forEach(server => {
            let date = new Date(server.createdTime);
            server.createdTime = date.toLocaleDateString();
          });

          response.data.servers.forEach(server => {
            if (server.lastConnection !== "") {
                let date = new Date(server.lastConnection);
                server.lastConnection = date.toLocaleString();
            }
          });

          setServers(response.data.servers);
        })
        .catch(function (error) {
          console.log(error);
        });

  };

  async onBeforeSaveCell(row, cellName, cellValue) {
    // You can do any validation on here for editing value,
    // return false for reject the editing

    console.log(row._rev);
    const setServers = mServers => this.setState({servers: mServers});

    let result = false;

    if (cellName === "name") {
        await axios({
            method:'put',
            data: {
                name: cellValue,
                _rev: row._rev,
                url: row.url
            },
            url: SHARED_SERVER_URI + '/servers/' + row.id,
            headers: {'Authorization': 'Bearer ' + this.props.childProps.token.token}
            })
              .then(function(response) {
                console.log(response)
                result = true;
              })
              .catch(function (error) {
                console.log(error);
                result = false;
              });
    } else {
        await axios({
            method:'put',
            data: {
                url: cellValue,
                _rev: row._rev,
                name: row.name
            },
            url: SHARED_SERVER_URI + '/servers/' + row.id,
            headers: {'Authorization': 'Bearer ' + this.props.childProps.token.token}
            })
              .then(function(response) {
                console.log(response)
                result = true;
              })
              .catch(function (error) {
                console.log(error);
                result = false;
              });
    }

    if (result === true) {
        await axios({
            method:'get',
            url: SHARED_SERVER_URI + '/servers',
            headers: {'Authorization': 'Bearer ' + this.props.childProps.token.token}
            })
              .then(function(response) {
                console.log(response)
      
                response.data.servers.forEach(server => {
                  let date = new Date(server.createdTime);
                  server.createdTime = date.toLocaleDateString();
                });
      
                response.data.servers.forEach(server => {
                  if (server.lastConnection !== "") {
                      let date = new Date(server.lastConnection);
                      server.lastConnection = date.toLocaleString();
                  }
                });
      
                setServers(response.data.servers);
              })
              .catch(function (error) {
                console.log(error);
              });
    }

    return result;
  }

  customConfirm(next, dropRowKeys) {
    console.log(dropRowKeys);
    //Async/Await y si sale todo bien, confirmo el DELETE de las rows.
    
  }

  onAddRow(row) {
      
  }

  render() {
    const options = {
        onAddRow: this.onAddRow,
        handleConfirmDeleteRow: this.customConfirm,
        noDataText: 'La información aun no ha cargado.'
    };

    const selectRowProp = {
        mode: 'checkbox'
    };
    
    const cellEditProp = {
        mode: 'dbclick',
        blurToSave: true,
        beforeSaveCell: this.onBeforeSaveCell
    };

    return (
      <div>
        <BootstrapTable ref='serverTable' data={ this.state.servers } insertRow={ true } deleteRow={ true } selectRow={ selectRowProp } options={ options }
                    headerStyle={ { background: '#f8f8f8' } } cellEdit={ cellEditProp }>
            <TableHeaderColumn dataField='id' editable={ false } isKey={ true } width='70'>ID</TableHeaderColumn>
            <TableHeaderColumn dataField='name' width='200'>Nombre</TableHeaderColumn>
            <TableHeaderColumn dataField='url' width='320'>Server URL</TableHeaderColumn>
            <TableHeaderColumn dataField='createdBy' editable={ false } width='120'>Creado por</TableHeaderColumn>
            <TableHeaderColumn dataField='createdTime' editable={ false } width='150'>Fecha de creación</TableHeaderColumn>
            <TableHeaderColumn dataField='lastConnection' editable={ false }>Última conexión</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}