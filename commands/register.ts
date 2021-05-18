import Discord from 'discord.js'
import axios from 'axios'
import fs from 'fs'
export default {
  name: 'register',
  run (client, interaction) {
    if (require('/home/azureuser/releaser/data/repos.json')[interaction.data.options.find(x => x.name == 'repo').value]) {
      axios.post(`https://discord.com/api/v8/interactions/${interaction.id}/${interaction.token}/callback`, {
        type: 4,
        data: {
          embeds: [
            new Discord.MessageEmbed()
              .setTitle('이미 등록됨')
              .setColor('RANDOM')
              .setDescription(`\`Team-int/${interaction.data.options.find(x => x.name == 'repo').value}\`는 이미 등록되어 있어요`)
              .setFooter(client.users.cache.get(interaction.member.user.id).tag, client.users.cache.get(interaction.member.user.id).displayAvatarURL())
              .setTimestamp()
              .toJSON()
          ]
        }
      })
    } else {
      let file = require('/home/azureuser/releaser/data/repos.json')
      file[interaction.data.options.find(x => x.name == 'repo').value] = {
        version: 'none',
        commits: []
      }
      fs.writeFile('/home/azureuser/releaser/data/repos.json', JSON.stringify(file), err => {
        axios.post(`https://discord.com/api/v8/interactions/${interaction.id}/${interaction.token}/callback`, {
          type: 4,
          data: {
            embeds: [
              new Discord.MessageEmbed()
                .setTitle('레포 등록됨')
                .setColor('RANDOM')
                .setDescription(`\`Team-int/${interaction.data.options.find(x => x.name == 'repo').value}\`를 등록했어요. 앞으로 모든 커밋이 기록돼요.`)
                .setFooter(client.users.cache.get(interaction.member.user.id).tag, client.users.cache.get(interaction.member.user.id).displayAvatarURL())
                .setTimestamp()
                .toJSON()
            ]
          }
        })
      })
    }
  }
}