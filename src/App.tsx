import { createApiClient } from "./api/client"
import { useFetch } from "./api/use-fetch"

function App() {
  const petId = "petId"
  const { data, error } = useFetch({
    path: "/pets/{petId}",
    params: { paths: { petId } },
    onError: e => {
      // result='error'の場合のエラー
      if (e.status === 400) {
        console.error(e.data.id)
      }
    },
  })

  if (!data) return null

  if (error && error.status !== 400) {
    return <p>{error.data.message}</p>
  }

  return (
    <div className="App">
      <p>{data.name}</p>
    </div>
  )
}

export default App
