const Database = require('../db/config')

module.exports = {
  async create(request, response) {
    const { password } = request.body
    const db = await Database()
    let roomId = null
    let roomsExistIds
    let isRoom = true
    
    while (isRoom) {
      for (let i = 0; i < 6; i++) {
        i === 0 ? roomId = Math.floor(Math.random() * 10).toString() :
                  roomId += Math.floor(Math.random() * 10).toString()
      }

      const roomsExistIds  = await db.all(`SELECT id FROM rooms `)

      isRoom = roomsExistIds.some(id => id === roomId)
    }

    await db.run(`INSERT INTO rooms (
        id,
        pass
    ) VALUES (
        ${parseInt(roomId)},
        ${password}
    )`)

    await db.close()

    response.redirect(`/room/${roomId}`)
  },

  async open(request, response){
    const db = await Database()

    const roomId = request.params.room

    const questions = await db.all(`SELECT * FROM questions WHERE room = ${roomId} and read = 0`)
    const questionsRead = await db.all(`SELECT * FROM questions WHERE room = ${roomId} and read = 1`)

    let isNoQuestions

    if(questions.length == 0) {
      if(questionsRead.length == 0){
        isNoQuestions = true
      }
    }

    response.render('room', {
      roomId, 
      questions ,
      questionsRead,
      isNoQuestions  
    })
  },

  async enter(request, response) {
    const { roomId } = request.body

    response.redirect(`/room/${roomId}`)
  }
}