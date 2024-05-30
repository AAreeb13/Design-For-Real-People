import { getGraphData } from "./../../database/graphData"

function TempButton() {
    return <button onClick={getGraphData}>Click Here to fetch data</button>
}


export default TempButton;