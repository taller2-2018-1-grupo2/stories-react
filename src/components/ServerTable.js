import React, { Component } from "react";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import axios from 'axios'

const SHARED_SERVER_URI = "https://shared-server-stories.herokuapp.com/api"
let mToken = null;

const setToken = token => mToken = token;

var servers = [];

async function onBeforeSaveCell(row, cellName, cellValue) {
    // You can do any validation on here for editing value,
    // return false for reject the editing

    console.log(row._rev);

    let result = false;

    if (cellName === "name") {
        await axios({
            method:'put',
            data: {
                name: cellValue,
                _rev: servers[servers.findIndex(element => element.id === row.id)]._rev,
                url: row.url
            },
            url: SHARED_SERVER_URI + '/servers/' + row.id,
            headers: {'Authorization': 'Bearer ' + mToken}
            })
              .then(function(response) {
                console.log(response)
                const server = response.data.server.server;
                servers[servers.findIndex(element => element.id === server.id)] = server;
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
                _rev: servers[servers.findIndex(element => element.id === row.id)]._rev,
                name: row.name
            },
            url: SHARED_SERVER_URI + '/servers/' + row.id,
            headers: {'Authorization': 'Bearer ' + mToken}
            })
              .then(function(response) {
                console.log(response)
                const server = response.data.server.server;
                servers[servers.findIndex(element => element.id === server.id)] = server;
                result = true;
              })
              .catch(function (error) {
                console.log(error);
                result = false;
              });
    }

    return result;
}

const selectRowProp = {
    mode: 'checkbox'
};

const cellEditProp = {
    mode: 'dbclick',
    blurToSave: true,
    beforeSaveCell: onBeforeSaveCell
};


export default class ServerTable extends Component {

  async componentDidMount(){
    //console.log(this.props.childProps.token.token)
    setToken(this.props.childProps.token.token);

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

          servers = response.data.servers;
        })
        .catch(function (error) {
          console.log(error);
        });

    this.setState({flag: true});
  };

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

    return (
      <div>
        <BootstrapTable ref='serverTable' data={ servers } insertRow={ true } deleteRow={ true } selectRow={ selectRowProp } options={ options }
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