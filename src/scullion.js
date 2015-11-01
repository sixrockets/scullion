import prequire from "parent-require"
import messageBuilder from "./messageBuilder"
import botManager from "./botManager"

const promise = Promise.resolve.bind(Promise)
const when = async (val, fun) => fun(await val)

export default class Scullion {
  constructor(config = {}){
    this.config = config
    this.bots = []
    this.middlewares = []
    this.adapters = []
    this.messageBuilder = this._loadMiddleware('./messageBuilder')
    this.botManager = this._loadMiddleware('./botManager')
  }

  get listener(){
    return async event => {
      try {
        await this._middlewares().reduce(when, promise(event))
      } catch (error) {
        console.trace(error)
      }
    }
  }

  loadMiddleware(middlewareName) {
    this.middlewares.push(this._loadMiddleware(middlewareName))
  }

  loadBot(botName) {
    this.bots.push(this._loadBot(botName))
  }

  loadAdapter(adapterName) {
    this.adapters.push(this._loadAdapter(adapterName))
  }

  _middlewares(){
    return [
      [this.messageBuilder],
      this.middlewares,
      [this.botManager]
    ].reduce((first, second) => first.concat(second))
  }

  _loadMiddleware(middlewareName) {
    process.stdout.write("loadMiddleware: ")
    console.log(middlewareName)
    return this.require(middlewareName).bind(this)
  }


  _loadBot(botName) {
    process.stdout.write("loadBot: ")
    console.log(botName)
    const BotClass = this.require(botName)(this)
    return new BotClass()
  }

  _loadAdapter(adapterName) {
    process.stdout.write("loadAdapter: ")
    console.log(adapterName)
    const adapter = this.require(adapterName)(this)
    adapter.on("event", this.listener)
    return adapter
  }

  require(moduleName) {
    if (typeof moduleName === 'string' || moduleName instanceof String) {
      try {
        return prequire(moduleName)
      } catch (error) {
        return require(moduleName)
      }
    }
    return moduleName
  }
}
