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
  let post:string = ''
  req.on('data', d => {
    post += d
  })
  req.on('end', () => {
    let parsedPost = JSON.parse(post)
    console.log(req.headers)
    res.writeHead(200)
    res.end()
    if (req.headers['x-github-event'] == 'push') {
      let confFile = require('/home/azureuser/releaser/data/repos.json')
      if (!confFile[parsedPost.repository.name]) return
      for (let commit of parsedPost.commits) {
        let firstLine = commit.message.split('\n')[0]
        let typeandbreakingandscope = firstLine.split(':')[0]
        let commitMsg = firstLine.replace(typeandbreakingandscope, '').replace(': ', '')
        let breaking = false
        let scope = undefined
        let type = undefined
        if (typeandbreakingandscope.endsWith('!')) {
          breaking = true
          typeandbreakingandscope = typeandbreakingandscope.split('').reverse().join('').replace('!', '').split('').reverse().join('')
        }
        if (typeandbreakingandscope.includes('(') && typeandbreakingandscope.includes(')')) {
          scope = typeandbreakingandscope.split('(').reverse()[0].replace(')', '')
        }
        if (typeandbreakingandscope.split('(')[0] == 'style') return
        const types = {
          fix: '버그 픽스',
          feat: '새 기능 추가',
          refactor: '리팩터링',
          docs: '문서 수정',
          perf: '성능 개선',
          test: '테스트 수트 수정',
          ci: 'CI 스크립트 수정',
          chore: '코드와 관련되지 않은 그 외 변경사항',
          build: '빌드 시스템/패키지 매니저 관련 수정',
          revert: '커밋 되돌리기'
        }
        if (!types[typeandbreakingandscope.split('(')[0]]) return
        type = types[typeandbreakingandscope.split('(')[0]]
        let commitObj = {
          date: `${new Date().getFullYear()}/${new Date().getMonth()}/${new Date().getDay()}`,
          msg: commitMsg,
          type,
          scope,
          breaking
        }
        confFile[parsedPost.repository.name].commits.unshift(commitObj)
      }
      fs.writeFileSync('/home/azureuser/releaser/data/repos.json', JSON.stringify(confFile))
    } else if (req.headers['x-github-event'] == 'repository') {
      if (parsedPost.action == 'deleted') {
        let confFile = require('/home/azureuser/releaser/data/repos.json')
        if (!confFile[parsedPost.repository.name]) return
        delete confFile[parsedPost.repository.name]
        fs.writeFileSync('/home/azureuser/releaser/data/repos.json', JSON.stringify(confFile))
      }
    }
  })
})
client.login(process.env.TOKEN).catch(console.log)
server.listen(2053)