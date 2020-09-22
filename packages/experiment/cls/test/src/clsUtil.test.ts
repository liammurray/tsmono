import { expect } from 'chai'
import { ctx } from '@nod15c/global-cls-context'

import { withCls } from '~/index'

function getFoo(): number {
  return ctx.namespace.get('foo') as number
}

function setFoo(val: number): void {
  ctx.namespace.set('foo', val)
}

describe('CLS', function () {
  it('normal usage', function () {
    // Return promise
    return ctx.run(async () => {
      expect(getFoo()).to.be.undefined
      setFoo(2)
      expect(getFoo()).to.equal(2)
      await ctx.run(() => {
        expect(getFoo()).to.equal(2)
        setFoo(3)
        expect(getFoo()).to.equal(3)
        return Promise.resolve()
      })
      expect(getFoo()).to.equal(2)
    })
  })

  it('withCls helper', async function () {
    function job(): Promise<number> {
      return Promise.resolve()
        .then(() => {
          expect(getFoo()).to.be.undefined
          setFoo(2)
          expect(getFoo()).to.equal(2)
        })
        .then(() => {
          expect(getFoo()).to.equal(2)
          setFoo(3)
          expect(getFoo()).to.equal(3)
          return getFoo()
        })
    }

    await expect(job()).to.be.rejectedWith(
      'No context available. ns.run() or ns.bind() must be called first.'
    )

    const decorated = withCls(job)
    const finalVal = await decorated()
    expect(finalVal).to.equal(3)
  })
})
