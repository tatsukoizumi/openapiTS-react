import {
  ApiError,
  ApiPathParam,
  ApiQueryParam,
  ApiResponse,
  ExactPathByHttpMethod,
} from "./schema-util"
import useSWR, { SWRConfiguration } from "swr"
import { createApiClient, RequestResponse } from "./client"
import { useCallback, useMemo } from "react"

type GetPath = ExactPathByHttpMethod<"get">

type UseFetchOption<Path extends GetPath> = {
  path: Path
  params?: {
    paths?: ApiPathParam<Path, "get">
    query?: ApiQueryParam<Path, "get">
  }
  shouldCancel?: boolean
  onSuccess?: (data: ApiResponse<Path, "get">) => void
  onError?: (error: ApiError<Path, "get">) => void
} & Omit<SWRConfiguration, "onSuccess" | "onError"> // revalidateOnFocus などのSWRのオプションも渡せるようにしておく

export const useFetch = <Path extends GetPath>(
  options: UseFetchOption<Path>
) => {
  const { path, params, onSuccess, onError, shouldCancel, ...swrOptions } =
    options

  const api = createApiClient({ path, httpMethod: "get", params })

  const {
    data: swrData,
    mutate: swrMutate,
    isValidating,
  } = useSWR<RequestResponse<Path, "get">>(
    shouldCancel ? null : api.path(),
    () => api.request(),
    {
      onSuccess: res => {
        if (res.result === "success" && !!onSuccess) {
          onSuccess(res.data)
          return
        }
        if (res.result === "error" && !!onError) {
          onError(res.error)
          return
        }
      },
      onError: e => {
        // unexpected error をハンドリング
        console.error(e.message)
      },

      ...swrOptions,
    }
  )

  const data = useMemo(() => {
    if (!swrData) return undefined
    if (swrData.result !== "success") return undefined
    return swrData.data
  }, [swrData])

  const error = useMemo(() => {
    if (!swrData) return undefined
    if (swrData.result !== "error") return undefined
    return swrData.error
  }, [swrData])

  const mutate = useCallback(
    (data?: ApiResponse<Path, "get">, shouldRevalidate?: boolean) => {
      swrMutate(
        data ? { result: "success", data } : undefined,
        shouldRevalidate
      )
    },
    [swrMutate]
  )

  return { data, error, mutate, isValidating }
}
