import React, { Component } from "react";
import { DropdownButton, MenuItem } from "react-bootstrap";
import {Pie} from 'react-chartjs-2';
import axios from 'axios'
import './StatsLobsterTitles.css'

const SHARED_SERVER_URI = "https://shared-server-stories.herokuapp.com/api"

export default class ActiveUsersPieChart extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
        stats: [],
        serversInfo: this.props.childProps.serversInfo,
        isDataReady: false,
        data: null
    };

    this.setStats = this.setStats.bind(this);
    this.setInitialData = this.setInitialData.bind(this);
  }

  async componentDidMount(){
    //console.log(this.props.childProps.token.token)

    const setServerStats = mStats => this.setInitialData(mStats);

    await axios({
        method:'get',
        url: SHARED_SERVER_URI + '/stats/users',
        headers: {'Authorization': 'Bearer ' + this.props.childProps.token.token}
        })
            .then(function(response) {
                setServerStats(response.data.servers_stats);
            })
            .catch(function (error) {
                console.log(error);
            });
  }

  setStats(id) {
    let total_actives = 0;
    let total_inactives = 0;

    if (id === "all") {
        this.state.stats.forEach(server => {
            total_actives = total_actives + parseInt(server.active_users);
            total_inactives = total_inactives + (server.total_users - server.active_users);
        });
    } else {
        const server = this.state.stats[this.state.stats.findIndex(server => server.id === id)];
        total_actives = parseInt(server.active_users);
        total_inactives = parseInt(server.total_users - server.active_users);
    }
    
    const mData = {
        labels: ['Activos','Inactivos'],
        datasets: [{
            data: [total_actives, total_inactives],
            backgroundColor: [
                '#FF6384',
                '#36A2EB'
            ],
            hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB'
            ]
        }]
    };

    this.setState({
        data: mData
    });
  }

  setInitialData(mStats) {
    let total_actives = 0;
    let total_inactives = 0;

    mStats.forEach(server => {
        total_actives = total_actives + parseInt(server.active_users);
        total_inactives = total_inactives + (server.total_users - server.active_users);
    });

    const mData = {
        labels: ['Activos','Inactivos'],
        datasets: [{
            data: [total_actives, total_inactives],
            backgroundColor: [
                '#FF6384',
                '#36A2EB'
            ],
            hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB'
            ]
        }]
    };

    this.setState({
        data: mData,
        stats: mStats,
        isDataReady: true
    });
  }

  render() {
    const setStats = this.setStats;

    var serversInfoMenuItems = this.state.serversInfo.map(function(server) {
        return (
            <MenuItem key={server.id} onClick={(e) => setStats(server.id, e)}>{server.name}</MenuItem>
        );
    });

    return (
        <div>
            <h2 className="lobsterTitle">Usuarios Activos</h2>
            <br/>
            <DropdownButton title={"Elegir fuente"} id={"dropdown"}>
                <MenuItem onClick={(e) => this.setStats("all", e)}>Todos</MenuItem>
                {serversInfoMenuItems}
            </DropdownButton>
            {this.state.isDataReady
              ? <Pie data={this.state.data} />
              : <h4>Cargando gráfico...</h4>
            }
        </div>
    );
  }
}