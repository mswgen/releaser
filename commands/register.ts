import Discord from 'discord.js'
import axios from 'axios'
import fs from 'fs'
export default {
  name: 'register',
  async run (client, interaction) {
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
      let repos:Array<string> = []
      let firstRes = await axios.get('https://api.github.com/organizations/79496277/repos?per_page=100&page=1', {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`
        }
      })
      for (let repo of firstRes.data) {
        repos.push(repo.name)
      }
      if (firstRes.headers.link) {
        for (let i = 2; i <= parseInt(firstRes.headers.link.split(', ').reverse()[0].replace('>; rel="last"', '').replace('<https://api.github.com/organizations/79496277/repos?page=', '')); i++) {
          let anotherRes = await axios.get(`https://api.github.com/organizations/79496277/repos?per_page=100&page=${i}`, {
            headers: {
              Authorization: `token ${process.env.GITHUB_TOKEN}`
            }
          })
          for (let repo of anotherRes.data) {
            repos.push(repo.name)
          }
        }
      }
      if (!repos.includes(interaction.data.options.find(x => x.name == 'repo').value)) {
        axios.post(`https://discord.com/api/v8/interactions/${interaction.id}/${interaction.token}/callback`, {
          type: 4,
          data: {
            embeds: [
              new Discord.MessageEmbed()
                .setTitle('없는 레포')
                .setColor('RANDOM')
                .setDescription(`\`Team-int/${interaction.data.options.find(x => x.name == 'repo').value}\`는 존재하지 않아요.`)
                .setFooter(client.users.cache.get(interaction.member.user.id).tag, client.users.cache.get(interaction.member.user.id).displayAvatarURL())
                .setTimestamp()
                .toJSON()
            ]
          }
        })
        return
      }
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