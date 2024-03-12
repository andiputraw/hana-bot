export const enum LogType {
  Info,
  Error,
  Runtime,
}
// deno-lint-ignore no-explicit-any
export function log(logType: LogType, ...args: any[]) {
  const isDebug = (Deno.env.get("DEBUG") || "true") === "true";
  if (isDebug || logType === LogType.Runtime) {
    let type;
    switch (logType) {
      case LogType.Info:
        type = "[INFO]: ";
        break;
      case LogType.Error:
        type = "[ERROR]: ";
        break;
      case LogType.Runtime:
        type = "[RUNTIME]: ";
        break;
      default:
        type = "[UNKNOWN]";
    }
    console.log(type, args);
  }
}
