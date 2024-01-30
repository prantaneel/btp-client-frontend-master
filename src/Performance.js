//panel to show the perfromance of the module
import React, { useState, useEffect } from "react";
import "./Controls.css";
import "./controlComp/ControlComp.css";
import useWebSocket, { ReadyState } from "react-use-websocket";
import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Performance() {
  const [data, setData] = useState("");
  const [plotData, setPlotData] = useState([]);
  const [cmseData, setCmseData] = useState([])
  let WS_URL = "ws://localhost:8000/ws/stream/picow_0/"
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      share: false,
      shouldReconnect: () => true,
    }
  );
  useEffect(() => {
    console.log(lastJsonMessage)
    if(lastJsonMessage !== null){
        let event_name = lastJsonMessage.event
        if(event_name==="measurement.created"){
            let iteration = lastJsonMessage.iteration
            let device = lastJsonMessage.device_id
            let mse = lastJsonMessage.mse
            let newData = {
                "iteration": iteration,
                "mse": mse
            }
            console.log(newData)
            setData(newData)
            let pdata = plotData
            pdata.push(newData)
            setPlotData([...pdata])
        }
    }

  }, [lastJsonMessage]);
  const handleErrorPerf = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:8000/train/process/0/').then((response)=> response.json()).then((data)=>{
      if(typeof(data)!==String){
        setCmseData(data)
      }
      // console.log(data)
    })
    
  }
  return (
    <div className="red-border flex-box-col width-60 margin-10 padding-20">
      <h1>Performance</h1>
      <div className="red-border padding-5 margin-5">
      <button className="button-style" onClick={handleErrorPerf}>Error Perf.</button>
        <div className="red-border margin-5">
          {
            plotData.length===0 ? "": (
              <div className="chart-center">
            <LineChart
              width={800}
              height={300}
              data={plotData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="iteration" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="mse"
                stroke="#82ca9d"
                isAnimationActive={false}
              />
            </LineChart>
          </div>
            )
          }
            {cmseData.map((item, index)=>(
              <div className="chart-center">
                <hr></hr>
              <h4 className="margin-10">{item["device"]}</h4>
              <h4 className="margin-10">Process: {item["p_id"]}</h4>
              <h4 className="margin-10">Strategy: {item["strategy"]}</h4>
              <hr></hr>
              <LineChart
                width={1000}
                height={300}
                data={JSON.parse(item["mse_array"])}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="iteration" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="mse"
                  stroke="#82ca9d"
                />
              </LineChart>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Performance;
