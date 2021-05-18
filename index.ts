import Discord from 'discord.js'
import dotenv from 'dotenv'
import ascii from 'ascii-table'
import fs from 'fs'
dotenv.config()
const table = new ascii().setHeading('Command', 'Load Status')
const client:Discord.Client = new Discord.Client();
(client as any).commands = new Discord.Collection()
fs.readdir('./commands/', (err, list) => {
  for (const file of list) {
    try {
      const pull = require(`./commands/${file}`)
      if (pull.name && pull.run) {
        table.addRow(file, '✅')
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
  data = JSON.parse(data)
  if (data.op != 0 || data.t != 'INTERACTION_CREATE') return
  data = data.d
  const cmd = data.data.name;
  (client as any).commands.get(cmd).run(client, data)
})
client.login(process.env.TOKEN)