import * as env from 'env-var'

export function envStr(key: string, defaultValue?: string): string {
  if (defaultValue) {
    return env.get(key).default(defaultValue).asString()
  }
  return env.get(key).required().asString()
}
export function envPort(key: string, defaultValue?: number): number {
  if (defaultValue != undefined) {
    return env.get(key).default(defaultValue).asPortNumber()
  }
  return env.get(key).required().asPortNumber()
}
export function envBool(key: string, defaultValue = false): boolean {
  return env.get(key).default(defaultValue.toString()).asBool()
}
