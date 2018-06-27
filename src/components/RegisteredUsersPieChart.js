import React, { Component } from "react";
import {Pie} from 'react-chartjs-2';
import axios from 'axios'
import './StatsLobsterTitles.css'

const SHARED_SERVER_URI = "https://shared-server-stories.herokuapp.com/api"

export default class RegisteredUsersPieChart extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
        stats: [],
        isDataReady: false,
        data: null
    };

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

  setInitialData(mStats) {
    let mLabels = []
    let mDatapoints = []
    const serversInfo = this.props.childProps.serversInfo;

    console.log(mStats);

    mStats.forEach(server => {
        if (serversInfo.findIndex(serverInfo => serverInfo.id === server.id) !== -1) {
            mLabels.push(serversInfo[serversInfo.findIndex(serverInfo => serverInfo.id === server.id)].name);
            mDatapoints.push(server.total_users);
        }
    });

    var colors = [];
    while (colors.length < mStats.length) {
        colors.push('#'+(Math.random()*0xFFFFFF<<0).toString(16));
    }

    const mData = {
        labels: mLabels,
        datasets: [{
            data: mDatapoints,
            backgroundColor: colors,
            hoverBackgroundColor: colors
        }]
    };

    this.setState({
        data: mData,
        stats: mStats,
        isDataReady: true
    });
  }

  render() {
    return (
        <div>
            <h2 className="lobsterTitle">Usuarios Registrados</h2>
            <br/>
            <div style={{marginTop: 44 + 'px'}}></div>
            {this.state.isDataReady
              ? <Pie data={this.state.data} />
              : <h4>Cargando gráfico...</h4>
            }
        </div>
    );
  }
}