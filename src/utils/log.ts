import { CONSTANT } from "../config/constant.ts";
export const enum LogType {
  Info,
  Error,
}
// deno-lint-ignore no-explicit-any
export function log(logType: LogType, ...args: any[]) {
  if (CONSTANT.DEBUG) {
    let type;
    switch (logType) {
      case LogType.Info:
        type = "[INFO]: ";
        break;
      case LogType.Error:
        type = "[ERROR]: ";
        break;
      default:
        type = "[UNKNOWN]";
    }
    console.log(type, args);
  }
}
