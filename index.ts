import Discord from 'discord.js'
import dotenv from 'dotenv'
import ascii from 'ascii-table'
dotenv.config()
const client:Discord.Client = new Discord.Client()
client.on('ready', () => {
  console.log(`Login ${(client.user as Discord.ClientUser).username}`)
})
client.login(process.env.TOKEN)