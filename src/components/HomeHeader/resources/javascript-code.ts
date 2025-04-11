export default `import { Listener } from 'ov0'

const app = new Listener({
  // 插件名称
  name: '',
  // 支持的适配器，适配器是事件发布来源
  adapters: ['onebot11']
})

app.on('message',(e)=>{
  // 作出回复
  e.reply('hello world!')
})`
