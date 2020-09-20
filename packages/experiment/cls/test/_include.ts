import chai from 'chai'
import sinonChai from 'sinon-chai'
import chaiAsPromised from 'chai-as-promised'

//import { Runner } from 'mocha'

chai.use(sinonChai).use(chaiAsPromised)

chai.config.includeStack = true

// Hook the mocha root suite (run) with CLS context
// See: https://github.com/mochajs/mocha/blob/master/lib/runner.js
// Don't do this because tests are run as one long chain (so keeps ctx)
//  before(function (done) {ctx.run(done) })
// const hookedRun = Runner.prototype.run
// Runner.prototype.run = function (fn) {
//   return ctx.run(hookedRun.bind(this, fn))
// }
