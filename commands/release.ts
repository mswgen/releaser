import Discord from 'discord.js'
import axios from 'axios'
import fs from 'fs'
export default {
  name: 'release',
  run (client, interaction) {
    let file = require('/home/azureuser/releaser/data/repos.json')
    if (!file[interaction.data.options.find(x => x.name == 'repo').value]) {
      axios.post(`https://discord.com/api/v8/interactions/${interaction.id}/${interaction.token}/callback`, {
        type: 4,
        data: {
          embeds: [
            new Discord.MessageEmbed()
              .setTitle('등록되지 않은 레포')
              .setColor('RANDOM')
              .setDescription(`\`Team-int/${interaction.data.options.find(x => x.name == 'repo').value}\`는 등록되어 있지 않아요`)
              .setFooter(client.users.cache.get(interaction.member.user.id).tag, client.users.cache.get(interaction.member.user.id).displayAvatarURL())
              .setTimestamp()
              .toJSON()
          ]
        }
      })
    } else {
      axios.post(`https://discord.com/api/v8/interactions/${interaction.id}/${interaction.token}/callback`, {
        type: 4,
        data: {
          embeds: [
            new Discord.MessageEmbed()
              .setTitle('릴리즈됨')
              .setColor('RANDOM')
              .setDescription(`\`Team-int/${interaction.data.options.find(x => x.name == 'repo').value}\`의 새 버전을 릴리즈했어요`)
              .setFooter(client.users.cache.get(interaction.member.user.id).tag, client.users.cache.get(interaction.member.user.id).displayAvatarURL())
              .setTimestamp()
              .toJSON()
          ]
        }
      })
      let relType = interaction.data.options.find(x => x.name == 'type').value
      let newVer = ''
      if (file[interaction.data.options.find(x => x.name == 'repo').value].version == 'none') {
        newVer = '1.0.0'
      } else {
        let parsedVer = file[interaction.data.options.find(x => x.name == 'repo').value].version.split('.').map(x => parseInt(x))
        if (relType == 'patch') {
          parsedVer[2] += 1
        } else if (relType == 'minor') {
          parsedVer[1] += 1
        } else {
          parsedVer[0] += 1
        }
        newVer = parsedVer.join('.')
      }
      const releaseTime = new Date()
      let changelogmd = `# ${interaction.data.options.find(x => x.name == 'repo').value} ${newVer}

[${releaseTime.getFullYear()}/${releaseTime.getMonth()}/${releaseTime.getDay()}] 버전 ${newVer} 릴리즈
`
      for (let commit of file[interaction.data.options.find(x => x.name == 'repo').value].commits) {
        changelogmd += `* [${commit.date}] ${commit.msg}\n  * 타입: ${commit.type}\n  * 적용 범위: ${commit.scope || '전체'}\n  * 커밋한 유저: ${commit.by}\n${commit.breaking ? '  * **주의: 이 커밋에 다른 프로그램의 코드 수정이 필요할 수 있는 큰 변경사항이 있어요**\n' : ''}`
      }
      client.channels.cache.get('844136138251173898').send(`${interaction.data.options.find(x => x.name == 'repo').value} 버전 ${newVer}이 릴리즈되었어요!`, new Discord.MessageAttachment(Buffer.from(changelogmd), 'CHANGELOG.md'))
      file[interaction.data.options.find(x => x.name == 'repo').value].commits = []
      file[interaction.data.options.find(x => x.name == 'repo').value].version = newVer
      fs.writeFileSync('/home/azureuser/releaser/data/repos.json', JSON.stringify(file))
    }
  }
}
