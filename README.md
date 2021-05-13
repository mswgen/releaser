# releaser

Track all commits from Team int, and create change log

## Limits

* This bot requires [Conventional Commit](https://conventionalcommits.org), and can understand only the first line of commit message.

* Only `fix`, `feat`, `build`, `ci`, `chore`, `perf`, `refactor`, `style`(ignored), and `test`.

* `BREAKING CHANGE` not supported. So you MUST use `<type>!`.

## How to use

1. At Team int Discord server, type `r.register <reponame>` to track the repository.

2. Commit! All the commits are tracked by github webhook.

3. Type `r.release <reponame> <patch|minor|major>` to generate change log.

## So, what's patch,major,minor?

Releaser internally version all releases. They all start from 1.0.0, and they increase by the following rule:

* bug fix, security fix, or something you might don't want to know: release type patch, third version number increases(`1.0.1`).

* minor changes you might know: release type minor, second version number increases(`1.1.0`).

* BIG ~~and beautiful~~ changes you might need to rewrite your program: release type major, first version number increases(`2.0.0`).
