//
//
//
const mongoose = require('mongoose')


async function isBoardOwner(context) {
    let boardId  = context.params.query.boardId || context.data.boardId
    if (!boardId)
        return context;

    const { _id } = context.params.user

    const boards = mongoose.model('boards')
    const board = await boards.findOne({ _id: boardId })
    if (!board)
        return context

    if ( board.ownerId.toString() == _id.toString() )
        return context
    else
        return Promise.reject( new Error('un-authorized') )
        // throw new Error('un-authorized 3') 
}

module.exports = {
    isBoardOwner
}
