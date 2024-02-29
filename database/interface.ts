export interface Database {
  // deno-lint-ignore no-explicit-any
  get<T = any>(key: Deno.KvKey): Promise<[T, boolean]>;
  set<T>(key: Deno.KvKey, value: T): Promise<boolean>;
}
