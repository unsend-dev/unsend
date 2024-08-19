# Unsend SDK

## Prerequisites

- [Unsend API key](https://app.unsend.dev/dev-settings/api-keys)
- [Verified domain](https://app.unsend.dev/domains)

## Installation

### NPM

```bash
npm install unsend
```

### Yarn

```bash
yarn add unsend
```

### PNPM

```bash
pnpm add unsend
```

### Bun

```bash
bun add unsend
```

## Usage

```javascript
import { Unsend } from "unsend";

const unsend = new Unsend({ apiKey: "us_12345" });

unsend.emails.send({
  to: "hello@acme.com",
  from: "hello@company.com",
  subject: "Unsend email",
  html: "<p>Unsend is the best open source product to send emails</p>",
  text: "Unsend is the best open source product to send emails",
});
```
