import { useEffect, useState } from "react";
import "./ControlComp.css";
import DropDown from "../mainComp/DropDown";
import DiffusionControls from "./DiffusionControls";
import IncrementalControls from "./IncrementalControls";
import ConsensusControls from "./ConsensusControls";
import TextBox from "../mainComp/TextBox";

export default function Strategy() {
  const strategyList = ["DIFFUSION_ATC", "DIFFUSION_CTA", "CONSENSUS"];
  const errorList = ["LMS", "OP2", "OP3"];

  const [selectedStrategy, setSelectedStrategy] = useState("DIFFUSION_ATC");
  const [stepSize, setStepSize] = useState(0);
  const [nodeSize, setNodeSize] = useState(0);
  const [iterations, setIterations] = useState(0);
  const [weightSize, setWeightSize] = useState(0);
  const [processId, setProcessId] = useState("NULL")
  const [lastProcessStrategy, setLastProcessStrategy] = useState("NULL")

  const receiveStrategyState = (data) => {
    setSelectedStrategy(data);
  };
  const receiveStepSize = (data) => {
    setStepSize(data);
  };
  const receiveNodeSize = (data) => {
    setNodeSize(data);
  }
  const receiveIterations = (data) => {
    setIterations(data);
  }
  const receiveWeightSize = (data) => {
    setWeightSize(data);
  }
  const divToRender = [
    <IncrementalControls></IncrementalControls>,
    <DiffusionControls></DiffusionControls>,
    <ConsensusControls></ConsensusControls>,
  ];
  const handleTrain = async (e) => {
    e.preventDefault();
    if(stepSize===0 || nodeSize===0 || iterations===0 || weightSize===0){
      console.log("Enter valid training params")
      return
    }
    fetch('http://127.0.0.1:8000/train/', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"stepSize": stepSize, "nodeNumber": nodeSize, "iterations": iterations, "weightSize": weightSize, "strategy": selectedStrategy}),
    }).then((response)=>response.json()).then((data)=>{
      console.log(data)
      return fetch('http://127.0.0.1:8000/train/last_data')
    }).then(response2 => response2.json()).then(data2=>{
      console.log(data2)
      setProcessId(data2["p_id"])
      setLastProcessStrategy(data2["strategy"])
    })
    

  }
  const handleTrainAbort = async (e) => {
    e.preventDefault();
    const response = await fetch('http://127.0.0.1:8000/train/abort/', {
      method: 'POST',
      body: JSON.stringify({
        "abort": 1
      }),
      headers:{
        'Content-Type': 'application/json',
      }
    });
    const result = await response.json()
    console.log(result)
  }

  return (
    <div className="red-border flex-box padding-5 margin-5">
      <div className="red-border margin-5 width-30">
        <h4 className="margin-5 red-border padding-5">Process: {processId} <br></br>Strategy: {lastProcessStrategy}</h4>
        <DropDown
          listName="Strategy"
          optionList={strategyList}
          sendData={receiveStrategyState}
          defaultValue={"DIFFUSION_ATC"}
        ></DropDown>
        <TextBox fieldName="Step Size" sendData={receiveStepSize}></TextBox>
        <TextBox fieldName="Number of Nodes" sendData={receiveNodeSize}></TextBox>
        <TextBox fieldName="Number of Iterations" sendData={receiveIterations}></TextBox>
        <TextBox fieldName="Size of W_opt" sendData={receiveWeightSize}></TextBox>
        <button className="button-style" onClick={handleTrain}>Train</button>
        <button className="button-style button-red" onClick={handleTrainAbort}>Abort</button>
      </div>
      <div className="red-border width-70 margin-5 flex-box-col">
        <img className="width-100" src="/static/node_topology.png"></img>
      </div>
      
    </div>
  );
}
// Strategy, algorithm, step size, protocol