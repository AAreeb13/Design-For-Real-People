import { useState } from 'react'
import Graph from "./components/Graph"
import TempButton from './components/TempButton'
import 'bootstrap/dist/css/bootstrap.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Hello World</h1>
      <div>Graph should be here</div>
      <Graph 
        nodes={[
          {name: 'abcdef'}, 
          {name: 'b'},
          {name: 'c'},
          {name: 'd'}
        ]}
        links={[
          {source: 'abcdef', target: 'b'},
          {source: 'b', target: 'c'}
        ]}/>
      <TempButton />
    </>
  )
}

export default App
