import Discord from 'discord.js'
import dotenv from 'dotenv'
import ascii from 'ascii-table'
import fs from 'fs'
import http2 from 'http2'
dotenv.config()
const table = new ascii().setHeading('Command', 'Load Status')
const client:Discord.Client = new Discord.Client();
(client as any).commands = new Discord.Collection()
fs.readdir('./dist/commands/', (err, list) => {
  for (const file of list.filter(x => x.endsWith('.js'))) {
    try {
      const pull = require(`./commands/${file}`).default
      if (pull.name && pull.run) {
        table.addRow(file, '✅');
        (client as any).commands.set(pull.name, pull)
      } else {
        table.addRow(file, '❌ -> Error')
        continue
      }
    } catch (e) {
      table.addRow(file, `❌ -> ${e}`)
      continue
    }
  }
  console.log(table.toString())
})
client.on('ready', () => {
  console.log(`Login ${(client.user as Discord.ClientUser).username}`)
})
client.on('raw', data => {
  if (data.op != 0 || data.t != 'INTERACTION_CREATE') return
  data = data.d
  const cmd = data.data.name;
  (client as any).commands.get(cmd).run(client, data)
})
const server = http2.createSecureServer({
  cert: fs.readFileSync('/home/azureuser/cf-certs/cert.pem'),
  key: fs.readFileSync('/home/azureuser/cf-certs/key.pem'),
  allowHTTP1: true
}, (req, res) => {
  if (req.url != `/${process.env.WEBHOOK_SECRET}`) {
    res.writeHead(403)
    res.end()
    return
  }
  if (req.method != 'POST') {
    res.writeHead(405)
    res.end()
    return
  }
  let post = ''
  req.on('data', d => {
    post += d
  })
  req.on('end', () => {
    post = JSON.parse(post)
    console.log(post)
    res.writeHead(200)
    res.end()
  })
})
client.login(process.env.TOKEN).catch(console.log)
server.listen(2053)