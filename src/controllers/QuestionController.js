const Database = require('../db/config')

module.exports = {
  async index(request, response) {
    const db = await Database()

    const { room, question, action } = request.params
    const { password } = request.body

    /* Verificar se a senha está correta */
    const verifyRoom = await db.get(`SELECT * FROM rooms WHERE id = ${room}`)
    if(verifyRoom.pass == password){
        if(action == "delete"){

            await db.run(`DELETE FROM questions WHERE id = ${question}`)

        }else if(action == "check"){

            await db.run(`UPDATE questions SET read = 1 WHERE id = ${question}`)

        }
        response.redirect(`/room/${room}`)
    }else{
      response.render('pass-incorrect', { roomId: room })
    }
  },

  async create(request, response) {
    const db = await Database()

    const { question } = request.body
    const { room } = request.params

    db.run(`INSERT INTO questions (
      title,
      room,
      read
    )VALUES (
      "${question}",
      ${room},
      0
    )`)

    response.redirect(`/room/${room}`)
  }
} 