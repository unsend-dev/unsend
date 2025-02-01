<p align="center">
  <img style="width: 200px;height: 200px; margin: auto;" src="https://github.com/unsend-dev/unsend/assets/24666922/76268b21-0786-4f89-aa0f-e003fd0a6d60" alt="Unsend Logo">
</p>

<p align="center" style="margin-top: 20px">
  <p align="center">
  The Open Source sending infrastructure.
  <br>
    <a href="https://unsend.dev"><strong>Learn more »</strong></a>
    <br />
    <br />
    <a href="https://discord.gg/BU8n8pJv8S">Discord</a>
    .
    <a href="https://unsend.dev">Website</a>
    ·
    <a href="https://github.com/unsend-dev/unsend/issues">Issues</a>
  </p>
</p>

<p align="center">
   <a href="https://discord.gg/BU8n8pJv8S"><img src="https://img.shields.io/badge/Discord-unsend-%235865F2" alt="Join Unsend on Discord"></a>
   <a href="https://github.com/unsend-dev/unsend/stargazers"><img src="https://img.shields.io/github/stars/unsend-dev%2Funsend" alt="Github Stars"></a>
   <a href="https://github.com/unsend-dev/unsend/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-AGPLv3-purple" alt="License"></a>
   <a href="https://hub.docker.com/r/unsend/unsend"><img alt="Docker Automated build" src="https://img.shields.io/docker/pulls/unsend/unsend"></a>
</p>

<div align="center">
  <img src="https://github.com/unsend-dev/unsend/assets/24666922/68c41a6f-8fd1-4a3e-8d9b-987dda105c22" style="width: 100%;" />
</div>

## About this project

As most of email products out there, Unsend also uses Amazon SES under the hood to send emails. We provide an open and alternative way to send emails reliably and cheaply with a great dashboard. You can also use Unsend manage contacts and send bulk emails(newsletter, product updates etc). We will take care of the subscriptions.

Currently we only support emails, but we plan to expand to other sending protocols like SMS, push notification and even whatsapp.

We are currently in beta and trying to rollout to public slowly. If you're interested [join our waitlist](https://app.youform.io/forms/caja89vr) or drop in a message in discord.

## Features

- [x] Add domains
- [x] Transactional Mails
- [x] Rest API
- [x] Dashboard (Delivered, opened, clicked, bounced)
- [x] Marketing email
- [x] SMTP support
- [x] Schedule API
- [x] API Logs
- [ ] Webhook support
- [ ] BYO AWS credentials

## Community and Next Steps 🎯

We're currently working on opening unsend for public beta.

- Check out the first source code release in this repository and test it.
- Tell us what you think in the [Discussions](https://github.com/unsend-dev/unsend/discussions).
- Join the [Discord server](https://discord.gg/BU8n8pJv8S) for any questions and getting to know to other community members.
- ⭐ the repository to help us raise awareness.
- Spread the word on Twitter.
- Fix or create [issues](https://github.com/unsend-dev/unsend/issues), that are needed for the first production release.

## Tech Stack

- [Next.js](https://nextjs.org/) - Framework
- [Prisma](https://www.prisma.io/) - ORM
- [Tailwind](https://tailwindcss.com/) - CSS
- [shadcn/ui](https://ui.shadcn.com/) - Component Library
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [tRPC](https://trpc.io/) - API
- [hono](https://hono.dev/) - Public API
- [Redis](https://redis.io/) - Queue

### Email editor

Check out the editor code for [here](https://github.com/unsend-dev/unsend/tree/main/packages/email-editor). Editor is possible only because of the amazing tools and libraries.

- [jsx-email](https://jsx.email/) - converts editor content to html
- [maily.to](https://maily.to/) - unsend email editor is greatly inspired from maily.to
- [tiptap](https://tiptap.dev/) - editor core

## Local Development

Follow our detailed guide to run Unsend locally

[https://docs.unsend.dev/get-started/local](https://docs.unsend.dev/get-started/local)

## Docker

We provide a Docker container for Unsend, which is published on both DockerHub and GitHub Container Registry.

DockerHub: [https://hub.docker.com/r/unsend/unsend](https://hub.docker.com/r/unsend/unsend)

GitHub Container Registry: [https://ghcr.io/unsend-dev/unsend](https://ghcr.io/unsend-dev/unsend)

You can pull the Docker image from either of these registries and run it with your preferred container hosting provider.

Please note that you will need to provide environment variables for connecting to the database, redis, aws and so forth.

For detailed instructions on how to configure and run the Docker container, please refer to the Docker [Docker README](./docker/README.md) in the docker directory.

## Self Hosting

Checkout the [Self hosting](https://docs.unsend.dev/get-started/self-hosting) guide to learn how to self-host Unsend.

Also

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/QbMnwX?referralCode=oaAwvp)


## Star History

<a href="https://star-history.com/#unsend-dev/unsend&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=unsend-dev/unsend&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=unsend-dev/unsend&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=unsend-dev/unsend&type=Date" />
 </picture>
</a>


## Sponsors

We are grateful for the support of our sponsors.

### Our Sponsors

<a href="https://doras.to/" target="_blank">
  <img src="https://cdn.doras.to/doras/assets/05c5db48-cfba-49d7-82a1-5b4a3751aa40/49ca4647-65ed-412e-95c6-c475633d62af.png" alt="doras.to" style="width:60px;height:60px;">
</a>
