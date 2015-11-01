const rp = require("request-promise").defaults({ simple: false, followRedirect: false, resolveWithFullResponse: true})

export default class Message {
  constructor(message) {
    Object.assign(this, message)
  }

  get http(){
    return rp
  }

  hear(regexp, cb) {
    const result = regexp.exec(this.message.text)
    if (result) cb(result)
  }

  random(arr){
    return arr[Math.floor(Math.random() * arr.length)];
  }

  command(commandText, regExp, cb) {
    const hasRegExp = (cb === void 0)
    const callback = hasRegExp ? regExp : cb
    const regexp = hasRegExp ? /.*/ : regExp
    const commandRegexp = new RegExp(`^[/@#]?${commandText}\\s*(.*)$`, "i")
    let result = commandRegexp.exec(this.message.text)
    result = result && regexp.exec(result[1])
    if (result) callback(result)
  }
}
