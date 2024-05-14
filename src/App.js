import Controls from "./Controls";
import Performance from "./Performance";
import "./App.css"


function App() {
  return (
    <div className="flex-main">
      {/* This is the container */}
      <h1 className="red-border flex-box-col width-60 margin-10 padding-20">Control Panel for Distributed Node Training</h1>
      <div className="flex-main-row width-100">
        <Controls></Controls>
        <Performance></Performance>
      </div>
    </div>
  );
}

export default App;
