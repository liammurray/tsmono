import { ctx } from '@nod15c/global-cls-context'

/**
 * Wraps function that returns promise so it is called under CLS namespace
 *
 * await job()
 *
 * const decorated = withCls(job)
 * await deocratedJob() <== same signature and semantics
 *
 * Enable await-thenable recommended
 *
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withCls<A extends any[], R>(
  fn: (...args: A) => Promise<R>
): (...args: A) => Promise<R> {
  // wrapper
  return async (...args: A): Promise<R> => {
    return ctx.run(() => {
      // call wrappee under cls namespace
      return fn(...args)
    })
  }
}
