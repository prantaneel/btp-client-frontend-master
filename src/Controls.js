import './Controls.css'
import Strategy from './controlComp/Strategy';


function Controls(){
    return(
        <div className="red-border flex-box-col width-60 margin-10 padding-20">
            <h1>Controls</h1>
            <Strategy></Strategy>
        </div>
    );
}

export default Controls;