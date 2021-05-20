# releaser

Tracks all commits from Team int, and create change log

## Limits

* Usage of this bot requires commits to follow [Conventional Commit](https://conventionalcommits.org), and can only understand  the first line of commit message.

* Only `fix`, `feat`, `build`, `ci`, `chore`, `perf`, `refactor`, `style`(ignored), and `test`.

* `BREAKING CHANGE` not supported. You MUST use `<type>!`.

## Usage

1. On the Team int Discord server, type `/register <reponame>` to track the repository.

2. Commit && push! All the commits are tracked by the GitHub webhook.

3. Type `/release <reponame> <patch|minor|major>` to generate change log.

## So, what exactly is a patch, major or minor?

Releaser internally versions all releases. They all start from 1.0.0, and they increase by the following rule:

* For bug fixes, security fixes, or not-breaking changes: release type patch, The third digit of the version increases(`1.0.1`).

* Minor changes you might need to know: release type minor, second digit of the version number increases(`1.1.0`).

* BIG ~~and beautiful~~ changes you might need to rewrite your program: release type major, first digit of the version number increases(`2.0.0`).
