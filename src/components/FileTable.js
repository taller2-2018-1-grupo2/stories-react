import React, { Component } from "react";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import axios from 'axios'

const SHARED_SERVER_URI = "https://shared-server-stories.herokuapp.com/api"

export default class FileTable extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
        files: [],
        serverID: null,
        serverToken: null
    };

    this.customConfirm = this.customConfirm.bind(this);
    this.onBeforeSaveCell = this.onBeforeSaveCell.bind(this);
    this.loadFiles = this.loadFiles.bind(this);
  }

  async componentDidMount(){
    //console.log(this.props.childProps.serverID)
    this.loadFiles();
  };

  async onBeforeSaveCell(row, cellName, cellValue) {
    // You can do any validation on here for editing value,
    // return false for reject the editing

    console.log(this.state.serverToken);
    console.log(row._rev);

    let result = false;

    if (cellName === "resource") {
        await axios({
            method:'put',
            data: {
                resource: cellValue,
                _rev: row._rev,
                filename: row.filename,
                size: row.size,
                owner: row.owner
            },
            url: SHARED_SERVER_URI + '/files/' + row.id,
            headers: {'Authorization': 'Bearer ' + this.state.serverToken}
            })
              .then(function(response) {
                console.log(response)
                result = true;
              })
              .catch(function (error) {
                console.log(error);
                alert("No se pudo editar el servidor.");
                result = false;
              });
    } else {
        await axios({
            method:'put',
            data: {
                filename: cellValue,
                _rev: row._rev,
                resource: row.resource,
                size: row.size,
                owner: row.owner
            },
            url: SHARED_SERVER_URI + '/files/' + row.id,
            headers: {'Authorization': 'Bearer ' + this.state.serverToken}
            })
              .then(function(response) {
                console.log(response)
                result = true;
              })
              .catch(function (error) {
                console.log(error);
                alert("No se pudo editar el servidor.");
                result = false;
              });
    }

    this.loadFiles();

    return result;
  }

  async componentDidUpdate() {
      //console.log("UPDATE_TABLE" + this.props.childProps.serverID);
      this.loadFiles();
  }

  async loadFiles() {
    let mServerToken = null;

    const setFiles = mFiles => {
      this.setState({
        files: mFiles,
        serverID: this.props.childProps.serverID,
        serverToken: mServerToken
      })
    };

    if (this.state.serverID !== this.props.childProps.serverID) {
      await axios({
        method:'get',
        url: SHARED_SERVER_URI + '/servers/' + this.props.childProps.serverID,
        headers: {'Authorization': 'Bearer ' + this.props.childProps.token.token}
        })
          .then(function(response) {
            console.log(response)
            mServerToken = response.data.server.token.token;
            return axios({
                method:'get',
                url: SHARED_SERVER_URI + '/files',
                headers: {'Authorization': 'Bearer ' + response.data.server.token.token}
              })
          })
          .then(function(response) {
            console.log(response)

            response.data.files.forEach(file => {
              let date = new Date(file.createdTime);
              file.createdTime = date.toLocaleDateString();
            });
  
            response.data.files.forEach(file => {
              if (file.updatedTime !== "") {
                  let date = new Date(file.updatedTime);
                  file.updatedTime = date.toLocaleString();
              }
            });

            setFiles(response.data.files);
          })
          .catch(function (error) {
            console.log(error);
          });
    }
  }

  async customConfirm(next, dropRowKeys) {
    console.log(dropRowKeys);
    //Async/Await y si sale todo bien, confirmo el DELETE de las rows.
    await axios({
      method:'delete',
      url: SHARED_SERVER_URI + '/files/' + dropRowKeys,
      headers: {'Authorization': 'Bearer ' + this.state.serverToken}
      })
        .then(function(response) {
          console.log(response);
          next();
        })
        .catch(function (error) {
          console.log(error);
        });
  }

  render() {
    const options = {
      handleConfirmDeleteRow: this.customConfirm,
      noDataText: 'No hay archivos para este servidor.'
    };

    const selectRowProp = {
        mode: 'radio'
    };
    
    const cellEditProp = {
        mode: 'dbclick',
        beforeSaveCell: this.onBeforeSaveCell
    };

    return (
      <div>
        <BootstrapTable ref='fileTable' data={ this.state.files } 
          deleteRow={ true } selectRow={ selectRowProp }
            options={ options } headerStyle={{ background: '#f8f8f8' }} cellEdit={ cellEditProp }>
            <TableHeaderColumn dataField='id' hiddenOnInsert width='40' editable={ false } isKey={ true } >ID</TableHeaderColumn>
            <TableHeaderColumn dataField='resource' width='250' >URL</TableHeaderColumn>
            <TableHeaderColumn dataField='size' editable={ false } width='80'>Tamaño</TableHeaderColumn>
            <TableHeaderColumn dataField='filename' >Nombre</TableHeaderColumn>
            <TableHeaderColumn dataField='owner' hiddenOnInsert width='80' editable={ false } >Server ID</TableHeaderColumn>
            <TableHeaderColumn dataField='createdTime' width='160' hiddenOnInsert editable={ false } >Fecha de creación</TableHeaderColumn>
            <TableHeaderColumn dataField='updatedTime' width='160' hiddenOnInsert editable={ false }>Última actualización</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}