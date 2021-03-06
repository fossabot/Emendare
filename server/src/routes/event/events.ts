import socketIO from 'socket.io'
import { Event } from '../../models'

export const events = {
  name: 'events',
  callback: ({ socket }: { socket: socketIO.Socket }) => async () => {
    const gettedEvents = await Event.model.find().sort('-created')
    socket.emit('events/all', { data: gettedEvents })
  }
}
