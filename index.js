// const {canvas} = require('./src/canvas')()
// const draw = require('./src/draw')
const {init, draw} = require('./src/3d')
const freqWave = require('./src/freq-wave')
const raf = require('raf')

document.body.style = `
  background: #000;
`

let freq = 0

freqWave((max) => {
  freq = max
})

init(document.body, 1000)
tick()

function tick () {
  // add in some tweening to smooth animations
  draw(freq)
  raf(tick)
}
