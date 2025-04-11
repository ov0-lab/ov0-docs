export default `import { Listener,segment,useRes } from 'ov0'
import { Onebot11Adapter } from 'ov0-plugin-adapter-onebot11'

// 双尖括号里可以写入你需要适配器的联合类型
const app = new Listener<Onebot11Adapter>({
  // 插件名称
  name: '',
  // 支持的适配器
  adapters: ['onebot11']
})

app.on('message',(e)=> {
  const res = useRes(e)
  res.at(event.user_id)
     .text('hello')
     .image('https://xxx.com/1.png')
     .send()
})`
