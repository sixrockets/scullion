const isMessage = ({message}) => message.type === "message"

export default function botManager(event) {
  this.bots.forEach(bot => {
    if (bot.onEvent) bot.onEvent(event)
    if (isMessage(event) && bot.onMessage) bot.onMessage(event)
  })
  return event
}
