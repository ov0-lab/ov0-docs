import { useState } from 'react'
import CodePreview from './components/CodePreview'
import Details from './components/Details'
import Scene from './components/Scene'

function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div className="counter">
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>Send</button>
    </div>
  )
}

export default function HomeHeader() {
  return (
    <>
      <Scene />
      <div className='main'>
        <div className='code'>
          <div className='code-container'>
            <CodePreview />
            {/* <Counter /> */}
          </div>
        </div>
        <Details />
      </div>
    </>
  )
}
