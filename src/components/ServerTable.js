import React, { Component } from "react";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import axios from 'axios'
import validator from 'validator';
import { ToastContainer } from "react-toastr";
import "./Toastr.css";

const SHARED_SERVER_URI = "https://shared-server-stories.herokuapp.com/api"
let container;

export default class ServerTable extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
        servers: []
    };

    this.customConfirm = this.customConfirm.bind(this);
    this.onAddRow = this.onAddRow.bind(this);
    this.onBeforeSaveCell = this.onBeforeSaveCell.bind(this);
    this.nameValidator = this.nameValidator.bind(this);
    this.urlValidator = this.urlValidator.bind(this);
    this.customTitle = this.customTitle.bind(this);
    this.displayErrorToastr = this.displayErrorToastr.bind(this);
  }

  async componentDidMount(){
    //console.log(this.props.childProps.token.token)
    
    const setServers = mServers => this.setState({servers: mServers});
    const errorToastr = message => this.displayErrorToastr(message);

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
          errorToastr("No se pudieron cargar los datos.");
        });

  };

  async onBeforeSaveCell(row, cellName, cellValue) {
    // You can do any validation on here for editing value,
    // return false for reject the editing

    console.log(row._rev);
    const setServers = mServers => this.setState({servers: mServers});
    const errorToastr = message => this.displayErrorToastr(message);

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
                if (error.status === 409) {
                  errorToastr("No se pudo editar el servidor. Ya existe un servidor con ese nombre.");
                }
                errorToastr("No se pudo editar el servidor.");
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
                if (error.status === 409) {
                  errorToastr("No se pudo editar el servidor. Ya existe un servidor con ese nombre.");
                }
                errorToastr("No se pudo editar el servidor.");
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

  async customConfirm(next, dropRowKeys) {
    const errorToastr = message => this.displayErrorToastr(message);

    console.log(dropRowKeys);
    //Async/Await y si sale todo bien, confirmo el DELETE de las rows.
    await axios({
      method:'delete',
      url: SHARED_SERVER_URI + '/servers/' + dropRowKeys,
      headers: {'Authorization': 'Bearer ' + this.props.childProps.token.token}
      })
        .then(function(response) {
          console.log(response);
          next();
        })
        .catch(function (error) {
          console.log(error);
          errorToastr("No se pudo eliminar el servidor.");
        });
  }

  componentDidUpdate() {
      console.log("UPDATE");
  }

  onAddRow(row) {
      const setServers = mServers => this.setState({servers: mServers});
      const getServers = () => this.state.servers;
      const errorToastr = message => this.displayErrorToastr(message);

      const innerAsyncFct = async () => {
        await axios({
          method:'post',
          data: {
            name: row.name,
            url: row.url
          },
          url: SHARED_SERVER_URI + '/servers',
          headers: {'Authorization': 'Bearer ' + this.props.childProps.token.token}
          })
            .then(function(response) {
              console.log(response);
              let servers = getServers();

              let date = new Date(response.data.server.server.createdTime);
              response.data.server.server.createdTime = date.toLocaleDateString();
            
              servers.push(response.data.server.server);
              setServers(servers);
            })
            .catch(function (error) {
              console.log(error);
              if (error.status === 409) {
                errorToastr("No se pudo crear el servidor. Ya existe un servidor con ese nombre.");
              }
              errorToastr("No se pudo crear el servidor.");
            });
      }
      
      innerAsyncFct();
      return;
  }

  displayErrorToastr(message) {
    container.error(<div></div>, <em>{message}</em>, 
        {closeButton: true, timeOut: 3000}
      );
  }

  nameValidator(value) {
    const response = { isValid: true, notification: { type: 'success', msg: '', title: '' } };
    if (!validator.isAlphanumeric(value)) {
      this.displayErrorToastr("El nombre ingresado no es valido. (Alfanumerico)");
      response.isValid = false;
    }
    return response;
  }
  
  urlValidator(value) {
    const response = { isValid: true, notification: { type: 'success', msg: '', title: '' } };
    if (!validator.isURL(value)) {
      this.displayErrorToastr("La URL ingresada es invalida.");
      response.isValid = false;
    }
    return response;
  }

  customTitle(cell, row, rowIndex, colIndex) {
    return `Doble click para editar`;
  }

  render() {
    const options = {
        onAddRow: this.onAddRow,
        handleConfirmDeleteRow: this.customConfirm,
        noDataText: 'La información aun no ha cargado.',
        beforeShowError: (type, msg) => {
          return false;
        }
    };

    const selectRowProp = {
        mode: 'radio'
    };
    
    const cellEditProp = {
        mode: 'dbclick',
        beforeSaveCell: this.onBeforeSaveCell
    };

    const nameValidator = this.nameValidator;

    const urlValidator = this.urlValidator;

    return (
      <div>
        <ToastContainer
          ref={ref => container = ref}
          className="toast-top-right"
        />
        <BootstrapTable ref='serverTable' data={ this.state.servers } insertRow={ true } deleteRow={ true } selectRow={ selectRowProp } options={ options }
                    headerStyle={ { background: '#f8f8f8' } } cellEdit={ cellEditProp }>
            <TableHeaderColumn dataField='id' hiddenOnInsert editable={ false } isKey={ true } width='70'>ID</TableHeaderColumn>
            <TableHeaderColumn dataField='name' columnTitle={ this.customTitle } editable={{ type: 'textarea', validator: nameValidator }} width='200'>Nombre</TableHeaderColumn>
            <TableHeaderColumn dataField='url' editable={{ type: 'textarea', validator: urlValidator }} width='320'>Server URL</TableHeaderColumn>
            <TableHeaderColumn dataField='createdBy' hiddenOnInsert editable={ false } width='120'>Creado por</TableHeaderColumn>
            <TableHeaderColumn dataField='createdTime' hiddenOnInsert editable={ false } width='150'>Fecha de creación</TableHeaderColumn>
            <TableHeaderColumn dataField='lastConnection' hiddenOnInsert editable={ false }>Última conexión</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}