import React, { Component } from "react";
import { DropdownButton, MenuItem } from "react-bootstrap";
import {Bar} from 'react-chartjs-2';
import _ from 'lodash'
import axios from 'axios'
import './StatsLobsterTitles.css'

const SHARED_SERVER_URI = "https://shared-server-stories.herokuapp.com/api"

export default class StoriesBarChart extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
        stats: [],
        serversInfo: this.props.childProps.serversInfo,
        isDataReady: false,
        data: null
    };

    this.resetData = this.resetData.bind(this);
    this.setInitialData = this.setInitialData.bind(this);
    this.updateData = this.updateData.bind(this);
  }

  async componentDidMount(){
    //console.log(this.props.childProps.token.token)

    const loadStats = mStats => this.setInitialData(mStats);

    await axios({
        method:'get',
        url: SHARED_SERVER_URI + '/stats/stories',
        headers: {'Authorization': 'Bearer ' + this.props.childProps.token.token}
        })
            .then(function(response) {
                loadStats(response.data.servers_stats);
            })
            .catch(function (error) {
                console.log(error);
            });
  }

  updateData(timestamps, mStats) {
    let groupedResults = _.groupBy(timestamps, (timestamp) => {
        const mDate = new Date(timestamp);
        return mDate.getUTCDate();
    });

    let mLabels = [];
    let mDatapoints = [];

    for (var key in groupedResults) {
        if (groupedResults.hasOwnProperty(key)) {
            mLabels.push(key);
            mDatapoints.push(groupedResults[key].length);
        }
    }

    //ARMAR GRAFICO
    const mData = {
        labels: mLabels,
        datasets: [
            {
            label: 'Últimos 10 dias',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: mDatapoints
            }
        ]
    };

    this.setState({
        data: mData,
        stats: mStats,
        isDataReady: true
    });
  }

  resetData(id) {
    console.log(id);
    let timestamps = [];

    if (id === "all") {
        this.setInitialData(this.state.stats);
    } else {
        let serverStats = [];

        if (this.state.stats.findIndex(server => server.id === id) !== -1) {
            serverStats = this.state.stats[this.state.stats.findIndex(server => server.id === id)].stats;
        }

        serverStats.forEach(request => {
            timestamps.push(request.timestamp);
        });

        this.updateData(timestamps, this.state.stats);
    }
  }

  setInitialData(mStats) {
    let timestamps = [];

    mStats.forEach(server => {
        server.stats.forEach(request => {
            timestamps.push(request.timestamp);
        });
    });

    this.updateData(timestamps, mStats);
  }

  render() {
    const resetData = this.resetData;

    var serversInfoMenuItems = this.state.serversInfo.map(function(server) {
        return (
            <MenuItem key={server.id} onClick={(e) => resetData(server.id, e)}>{server.name}</MenuItem>
        );
    });

    return (
        <div>
            <h2 className="lobsterTitle">Historias Subidas (Últimos 10 dias)</h2>
            <br/>
            <DropdownButton title={"Elegir fuente"} id={"dropdown"}>
                <MenuItem onClick={(e) => this.resetData("all", e)}>Todos</MenuItem>
                {serversInfoMenuItems}
            </DropdownButton>
            {this.state.isDataReady
              ? <Bar data={this.state.data}/>
              : <h4>Cargando gráfico...</h4>
            }
        </div>
    );
  }
}