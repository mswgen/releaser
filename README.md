# releaser

Track all commits from Team int, and create change log

## Limits

* This bot requires [Conventional Commit](https://conventionalcommits.org), and can understand only the first line of commit message.

* Only `fix`, `feat`, `build`, `ci`, `chore`, `perf`, `refactor`, `style`(ignored), and `test`.

* `BREAKING CHANGE` not supported. So you MUST use `<type>!`.

## How to use

1. At Team int Discord server, type `r.register <reponame>` to track the repository.

2. Commit!

3. Type `r.release <reponame> <patch|minor|major>` to generate change log.
