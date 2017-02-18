const soundBoard = require('sound-board')

module.exports = onData => {
  soundBoard.downloadSound('song', './sounds/Red-Velvet.mp3')
    .then(() => soundBoard.play('song'))

  soundBoard.on('frequencyData', (key, bufferLength, dataArray) => {
    let max = 0
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0
      max = Math.max(v, max)
    }
    onData(max)
  })
}
