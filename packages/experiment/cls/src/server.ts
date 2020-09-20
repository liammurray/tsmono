import http from 'http'

const PORT = 3444

function calc(count): number {
  let inside = 0

  for (let i = 0; i < count; i++) {
    const x = Math.random() * 2 - 1
    const y = Math.random() * 2 - 1
    if (x * x + y * y < 1) {
      inside++
    }
  }

  return (4.0 * inside) / count
}

const requestLogs: unknown[] = []
const server = http.createServer((req, res) => {
  const piApprox = calc(100000)
  requestLogs.push({ url: req.url, piApprox, date: new Date() })

  res.end(JSON.stringify(requestLogs))
})

console.log(`Server listening on ${PORT}`)
server.listen(PORT)
