import { useEffect, useState } from "react";
import "./ControlComp.css";
import DropDown from "../mainComp/DropDown";
import DiffusionControls from "./DiffusionControls";
import IncrementalControls from "./IncrementalControls";
import ConsensusControls from "./ConsensusControls";
import TextBox from "../mainComp/TextBox";

export default function Strategy() {
  const strategyList = ["DIFFUSION_ATC", "DIFFUSION_CTA", "CONSENSUS", "INCREMENTAL"];
  const algoList = ["LMS", "KLLMS", "SLMS", "BLMS", "AALMS"];

  const [selectedStrategy, setSelectedStrategy] = useState("DIFFUSION_ATC");
  const [selectedAlgo, setSelectedAlgo] = useState("LMS");
  const [stepSize, setStepSize] = useState(0);
  const [nodeSize, setNodeSize] = useState(0);
  const [iterations, setIterations] = useState(0);
  const [weightSize, setWeightSize] = useState(0);
  const [processId, setProcessId] = useState("NULL")
  const [lastProcessStrategy, setLastProcessStrategy] = useState("NULL")
  const [errorProb, setErrorProb] = useState(0)
  const [beta, setBeta] = useState(1)
  const [alpha, setAlpha] = useState(0)


  const receiveStrategyState = (data) => {
    setSelectedStrategy(data);
  };
  const receiveAlgoState = (data) => {
    setSelectedAlgo(data);
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
  const receiveErrorProb = (data) => {
    setErrorProb(data)
  }
  const receiveBeta = (data) => {
    setBeta(data)
  }
  const receiveAlpha = (data) => {
    setAlpha(data)
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
      body: JSON.stringify({"stepSize": stepSize, "nodeNumber": nodeSize, "iterations": iterations, "weightSize": weightSize, "strategy": selectedStrategy, "error_prob": errorProb, "algo": selectedAlgo, "alpha": alpha, "beta": beta}),
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
      <div className="red-border margin-5 width-100">
        <h4 className="margin-5 red-border padding-5">Process: {processId} <br></br>Strategy: {lastProcessStrategy}</h4>
        <DropDown
          listName="Strategy"
          optionList={strategyList}
          sendData={receiveStrategyState}
          defaultValue={"DIFFUSION_ATC"}
        ></DropDown>
        <DropDown
          listName="Algorithm"
          optionList={algoList}
          sendData={receiveAlgoState}
          defaultValue={"LMS"}
        ></DropDown>
        {selectedAlgo === "BLMS"? <TextBox fieldName="Beta" sendData={receiveBeta}></TextBox> : null}
        {selectedAlgo === "AALMS"? <TextBox fieldName="Alpha" sendData={receiveAlpha}></TextBox> : null}
        <TextBox fieldName="Step Size" sendData={receiveStepSize}></TextBox>
        <TextBox fieldName="Number of Nodes" sendData={receiveNodeSize}></TextBox>
        <TextBox fieldName="Number of Iterations" sendData={receiveIterations}></TextBox>
        <TextBox fieldName="Size of W_opt" sendData={receiveWeightSize}></TextBox>
        <TextBox fieldName="Error Probability" sendData={receiveErrorProb}></TextBox>
        <button className="button-style" onClick={handleTrain}>Train</button>
        <button className="button-style button-red" onClick={handleTrainAbort}>Abort</button>
      </div>
      
    </div>
  );
}
// Strategy, algorithm, step size, protocol