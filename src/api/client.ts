import axios from "axios"

import {
  ApiBody,
  ApiError,
  ApiPath,
  ApiPathParam,
  ApiQueryParam,
  ApiResponse,
  httpErrorStatusCodes,
  HttpMethod,
} from "./schema-util"

type CreateApiClientOption<Path extends ApiPath, Method extends HttpMethod> = {
  path: Path
  httpMethod: Method
  params?: {
    paths?: ApiPathParam<Path, Method>
    query?: ApiQueryParam<Path, Method>
    body?: ApiBody<Path, Method>
  }
}

export type RequestResponse<Path extends ApiPath, Method extends HttpMethod> =
  | { result: "success"; data: ApiResponse<Path, Method> }
  | { result: "error"; error: ApiError<Path, Method> }

export const createApiClient = <
  Path extends ApiPath,
  Method extends HttpMethod
>(
  option: CreateApiClientOption<Path, Method>
) => {
  const path = () => {
    // {trial_uid} などとなっているpathを実際の値に変換する
    const fullPath = Object.entries(option.params?.paths ?? {}).reduce(
      (prev, [key, value]) =>
        prev.replace(new RegExp(`\\{${key}\\}`), String(value)),
      option.path as string
    )

    const searchParam = new URLSearchParams()
    Object.entries(option.params?.query ?? {}).forEach(([key, value]) => {
      if (typeof value === "string") {
        searchParam.set(key, value)
      }
    })

    if (searchParam.toString().length > 0) {
      return fullPath + "?" + searchParam.toString()
    }

    return fullPath
  }

  const request = async (): Promise<RequestResponse<Path, Method>> => {
    try {
      const res = await axios.request<ApiResponse<Path, Method>>({
        baseURL: "",
        method: option.httpMethod,
        url: path(),
        data: option.params?.body,
        withCredentials: true,
      })
      return {
        result: "success",
        data: res.data,
      }
    } catch (e) {
      if (axios.isAxiosError(e) && !!e.response) {
        const errorData = { status: e.response.status, data: e.response.data }
        if (isExpectedError<Path, Method>(errorData)) {
          return {
            result: "error",
            error: errorData,
          }
        }
      }
      throw new Error("unexpected error")
    }
  }

  return { path, request }
}

// schema-utilで定義しているエラーコードのリストにレスポンスのステータスコードが含まれるかチェック
const isExpectedError = <Path extends ApiPath, Method extends HttpMethod>(res: {
  status: number
  data: any
}): res is ApiError<Path, Method> => {
  return httpErrorStatusCodes.map(Number).includes(res.status)
}
