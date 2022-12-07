import { paths } from "./schema"

export type ApiPath = keyof paths

// union( | ) to intersection( & )
type UnionToIntersection<T> = (T extends any ? (k: T) => void : never) extends (
  k: infer U
) => void
  ? U
  : never

export type HttpMethod = keyof UnionToIntersection<paths[keyof paths]>

// 指定したパスが取りうるhttpメソッドを絞り込む
export type ExactHttpMethodByPath<Path extends ApiPath> = HttpMethod &
  keyof UnionToIntersection<paths[Path]>

// 指定したhttpメソッドを取りうるパスを絞り込む
// key-remappingを使っている cf)https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as
export type ExactPathByHttpMethod<Method extends HttpMethod> = keyof {
  [K in keyof paths as keyof paths[K] extends Method ? K : never]: paths[K]
}
