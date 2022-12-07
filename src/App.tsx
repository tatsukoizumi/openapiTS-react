import { useEffect, useState } from "react"
import reactLogo from "./assets/react.svg"
import "./App.css"
import { createApiClient } from "../api-client"

function App() {
  const [count, setCount] = useState(0)

  const createPet = async () => {
    const api = createApiClient({
      path: "/pets",
      httpMethod: "post",
      params: {
        body: {
          name: "new_pet",
        },
      },
    })
    const res = await api.request()
    if (res.result === "success") {
      console.log(res.data)
    }
    if (res.result === "error") {
      if (res.error.status === 400) {
        const validationError = res.error.data.validationError
        console.error("error field is", validationError.field)
      }
      console.error(res.error.data.message)
    }
  }

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount(count => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
