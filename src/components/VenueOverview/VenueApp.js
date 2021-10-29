import React, { useState, useEffect } from "react";
import { Line } from 'react-chartjs-2';
import randomColor from "randomcolor";
import moment from 'moment';

export default function App(props) {
    const [chartData, setChartData] = useState(null);
    const [labels, setLabels] = useState([]);
    const [sensorsData, setSensorsData] = useState([]);
    const maxValueToDisplay = 1;
    const pointBorderWidth = 0.1;
    const pointBorderRadius = 4;
    const [completeDateLabels, setCompleteDateLabels] = useState([]);

    const generateData = () =>  {
      let datasets = [];
      let k = props.labelIndex;
      let dateLabels = [];
      var dateLabelsFlag = false;
      props.sensorsData.map((sensorItem) => {
       
        // let sensorsCount = parseInt(sensorItem.values.length/maxValueToDisplay);
        var sensorsCount = 1;
        if (!props.oneDayFlag)
           sensorsCount = 12;
        const sensors = sensorItem.values.filter((item, index) => {if (index%sensorsCount==0) return true; else return false;})
        if (!dateLabelsFlag) {
          dateLabels = sensors.map(sensor => {
              var time_to_show = sensor.date; // unix timestamp in seconds
              return moment(time_to_show).format("hh:mm a, DD MMM");

          });
          var cDateLabels = sensors.map(sensor => {
            var time_to_show = sensor.date; // unix timestamp in seconds
              if (props.oneDayFlag)
                  return moment(time_to_show).format("hh a");
              else
                  return moment(time_to_show).format("MMM DD");
          });
          setCompleteDateLabels(cDateLabels);
          dateLabelsFlag = true;
        }

        let newArray = [];
        for (let i = 0; i < dateLabels.length; i++) {
            let randomValue = 0;
            randomValue = sensorItem.values[i][labels[k]];
            newArray.push(randomValue);
        }
        var colorForSensors = randomColor();

        if ((sensorItem.key == "daily") || (sensorItem.key == "combine"))
          colorForSensors = 'blue';
        else {
          props.selectedSensors.map((item) => {
              if (item.name == sensorItem.key)
                colorForSensors = item.borderColor;
          })
        }
        datasets.push( {
            label: sensorItem.key ,
            backgroundColor: 'transparent',
            borderColor: colorForSensors,
            data: newArray,
            pointBorderWidth: pointBorderWidth,
            pointHoverRadius: pointBorderRadius,
            borderWidth: 1
        }); 
      })

      if (["co2", "voc", "pm25"].includes(labels[k])) {
        var resetHP = props.settingData.indoor? props.settingData.indoor[labels[k]].resetHP:0 ;
        var resetStandard = props.settingData.indoor? props.settingData.indoor[labels[k]].resetStandard: 0;
        var resetHps = []
        var resetStandards = []
        for (let i = 0; i < dateLabels.length; i++) {
            resetHps.push(resetHP); resetStandards.push(resetStandard);
        }
        datasets.push( {
            label: 'ResetHP',
            backgroundColor: 'transparent',
            borderColor: 'green',
            data: resetHps,
            pointBorderWidth: pointBorderWidth,
            pointHoverRadius: pointBorderRadius,
            borderWidth: 1
        });
        datasets.push( {
            label: 'ResetStandard',
            backgroundColor: 'transparent',
            borderColor: 'red',
            data: resetStandards,
            borderWidth: 1,
            pointBorderWidth: pointBorderWidth,
            pointHoverRadius: pointBorderRadius
        });
    }
      setChartData({
        labels: dateLabels,
        datasets: datasets
      })
    }
    useEffect(() => {
      setLabels(props.labels);
      setSensorsData(props.sensorsData);
      generateData();
    }, [props.labels, labels, props.sensorsData, sensorsData, props.labelIndex, props.settingData, props.selectedSensors])  
  
    const legend = {
        display: false,
        position: "bottom",
        labels: {
          fontColor: "#080000",
          fontSize: 18
        }
      };

    const renderLine = () => {
      var options =  {  
        scales: {
            xAxes: [{
             gridLines: {
          color: '#f6f6f6',
          borderDash: [1, 3],
        },
            ticks: {
              autoSkip: false,
              maxRotation: 0,
              minRotation: 0
            },
               afterTickToLabelConversion: function(data){
                   var xLabels = data.ticks;
                   xLabels.forEach(function (labels, i) {
                       if (i % parseInt(xLabels.length/10) != 0){
                           xLabels[i] = '';
                       }
                       else {
                         xLabels[i] = completeDateLabels[i];
                       }
                   });
               } 
           }]   
        },
        borderWidth: '0.5px'
      }
      if (chartData) {
        return (
          <div
            className="chart-container"
            style={{ position: 'relative', height: '300px', width: '80vw', fontSize: '5px'}}
          >
            <Line data={chartData} legend={legend} options={options} />
          </div>
        );
      } else return null;
    }
  
    return (
      <div className="App">{renderLine()}</div>
    )
  }
  