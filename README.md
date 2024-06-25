# Hana Bot

A serverless slash command discord bot for various guardian tales related
command.

This bot is designed to be runned on the [Deno Deploy](https://deno.com/deploy).
Thus it is easy to self host this bot.

## Available command

- `help [command]?`: Show help for a command.
- `hero [name]` : Show description about a hero.
- `alias`: Show alias that can be used for [name] parameter in `hero` command.
- `about`: about this bot

## Development

### 0. Prerequisite

#### 01. Tunneling

Because the nature of slash command in discord. you cannot setup localhost as
usual. that's mean you are need either to do port forwarding or do tunneling.

To do tunneling you can use something like [ngrok](ngrok.com) or
[cloudflare zero trust](https://developers.cloudflare.com/cloudflare-one/).

after that. do tunnel forwarding to port 8000 and save the url.

#### 02. Get Bot Credentials

#### 03. Install Deno

Install Deno [here](https://deno.com/).

### 1. Running

1. Clone this repository
2. Copy .env.example into .env
3. Fill the necessary values
4. open command line and then run `deno task start`

### 2. Add slash command to discord

1. run command `deno task slash`
2. if you are developing, you can say "no" in the prompt asking for "is global"
3. add all slash command

- Note that. if the environment variable for "ENV" Is not set into "PRODUCTION", every single command will be prefixed with "dev\_"

## Deploy

This project is primary targeted to [Deno Deploy](https://deno.com/deploy).
that's mean it is very easy to deploy there. it also have generous free tier so
you can try it out

1. Go to https://deno.com/deploy and then sign-in with github accont
2. Select new project and then add your repositories
3. Select create and deploy.
4. after that. go to the dasboard and then setting
5. Fill environtment variable based file .env.examples
