// import { expect } from 'chai'
import { ctx } from '~/index'

describe('Context', function () {
  it('should  handle layered context', function () {
    return ctx.run(() => {
      ctx.correlationIds.put({ parent: 'x' })
      ctx.run(function () {
        ctx.correlationIds.put({ child: 'y' })
        ctx.logger.info('hi from logger')
      })
      ctx.logger.info('hi from outside')

      // expect(timer.getMillisecs()).to.be.above(0)
      return Promise.resolve() // alternative is call done()
    })
  })
})
