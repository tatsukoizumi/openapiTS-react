import { useCallback, useState } from "react"
import { createApiClient } from "./client"
import {
  ApiBody,
  ApiError,
  ApiPathParam,
  ApiResponse,
  ExactHttpMethodByPath,
  ExactPathByHttpMethod,
  HttpMethod,
} from "../api/schema-util"

type SubmitHttpMethod = Exclude<HttpMethod, "get">
type SubmitPath = ExactPathByHttpMethod<SubmitHttpMethod>

type ExactSubmitMethod<Path extends SubmitPath> = SubmitHttpMethod &
  ExactHttpMethodByPath<Path>

type UseSubmitOption<
  Path extends SubmitPath,
  Method extends ExactSubmitMethod<Path>
> = {
  path: Path
  httpMethod: Method
  params?: {
    paths?: ApiPathParam<Path, Method>
  }
  onSuccess?: (data: ApiResponse<Path, Method>) => void
  onError?: (error: ApiError<Path, Method>) => void
  onRequestStarted?: () => void
  onRequestDone?: () => void
}

export const useSubmit = <
  Path extends SubmitPath,
  Method extends ExactSubmitMethod<Path>
>(
  option: UseSubmitOption<Path, Method>
) => {
  const {
    path,
    httpMethod,
    params,
    onSuccess,
    onError,
    onRequestStarted,
    onRequestDone,
  } = option

  const [requesting, setRequesting] = useState(false)
  const [data, setData] = useState<ApiResponse<Path, Method>>()
  const [error, setError] = useState<ApiError<Path, Method>>()

  const requestStart = useCallback(() => {
    setRequesting(true)
    if (!!onRequestStarted) {
      onRequestStarted()
    }
  }, [onRequestStarted])

  const requestDone = useCallback(() => {
    setRequesting(false)
    if (!!onRequestDone) {
      onRequestDone()
    }
  }, [onRequestDone])

  const request = useCallback(
    async (body?: ApiBody<Path, Method>) => {
      const api = createApiClient({
        path,
        httpMethod,
        params: { paths: params?.paths, body },
      })
      try {
        requestStart()

        const res = await api.request()

        requestDone()

        if (res.result === "success") {
          setData(res.data)
          if (!!onSuccess) {
            onSuccess(res.data)
          }
          return
        }

        if (res.result === "error") {
          setError(res.error)
          if (!!onError) {
            onError(res.error)
          }
        }
      } catch (e) {
        // apiエラー以外のエラーを捕捉
        requestDone()
        throw e
      }
    },
    [
      path,
      httpMethod,
      params?.paths,
      requestStart,
      requestDone,
      onSuccess,
      onError,
    ]
  )

  return { request, data, error, requesting }
}
