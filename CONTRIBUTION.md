# Contributing to Unsend

Welcome to Unsend! We're an open-source project aiming to create a robust, developer-friendly alternative to email-sending services like Resend, SendGrid, and Postmark. Whether you're a seasoned developer or a newcomer to open source, your contributions are valuable to us. This guide will walk you through how to get started, submit changes, and become part of our community.

## Why Contribute?

By contributing to Unsend, you'll:
- Help build a tool used by developers worldwide
- Gain experience with TypeScript, Node.js, AWS SES, and PostgreSQL
- Be part of an open-source community driving innovation in email infrastructure

## How to Contribute

### 1. Setting Up Your Environment

To contribute, you'll need to set up the project locally:

1. **Fork the Repository**: Click "Fork" on the [Unsend GitHub page](https://github.com/unsend/unsend) to create your own copy.

2. **Clone Your Fork**: 
   ```bash
   git clone https://github.com/YOUR-USERNAME/unsend.git
   ```

3. **Navigate to the Directory**: 
   ```bash
   cd unsend
   ```

4. **Install Dependencies**: 
   ```bash
   npm install
   ```
   (or `yarn install` if specified in the README)

5. **Set Up Environment Variables**: Copy `.env.example` to `.env` and fill in the required values (e.g., AWS SES credentials, database connection details).

6. **Run Locally**: Follow the README.md instructions to start the app (likely `npm run dev`).

### 2. Finding Something to Work On

- **Browse Issues**: Check the [Issues](https://github.com/unsend/unsend/issues) tab for bugs, feature requests, or enhancements.

- **Good First Issues**: Look for issues labeled `good first issue` if you're new to the project.

- **Propose Your Own**: If you have an idea, open a new issue to discuss it with the maintainers before starting work.

- **Claim an Issue**: Comment on an issue (e.g., "I'd like to work on this!") to avoid duplicate efforts.

### 3. Making Changes

1. **Create a Branch**: Use a descriptive name:
   ```bash
   git checkout -b feat/add-template-support
   # or
   git checkout -b fix/bug-description
   ```

2. **Follow Coding Standards**:
   - Use TypeScript with consistent typing
   - Adhere to the existing code style (e.g., Prettier formatting if configured)
   - Write modular, reusable code

3. **Test Your Changes**:
   - Run `npm test` (if tests exist) or manually verify your feature/fix works
   - Add new tests if applicable (e.g., using Jest)

4. **Update Documentation**: Modify the README or other docs if your changes affect setup, usage, or APIs.

### 4. Submitting Your Contribution

1. **Commit Changes**: Write clear, concise commit messages:
   ```
   feat: add email template parsing
   fix: resolve null pointer in SES integration
   docs: update README with new endpoint
   ```

2. **Push to Your Fork**: 
   ```bash
   git push origin your-branch-name
   ```

3. **Open a Pull Request (PR)**:
   - Go to the Unsend repo, click "Pull Requests," then "New Pull Request"
   - Select your branch and link it to an issue if applicable (e.g., `Fixes #71`)
   - Provide a detailed PR description:
     - What you changed
     - Why you made the change
     - How to test it

4. **Respond to Feedback**: Maintainers may request changes. Update your branch and push new commits as needed.

### 5. Getting Your PR Merged

- Ensure all checks (e.g., linting, tests) pass
- Address reviewer comments promptly
- Once approved, a maintainer will merge your PR. Congrats—you've contributed to Unsend!

## Development Guidelines

- **Tech Stack**: Unsend uses TypeScript, Node.js, AWS SES for email sending, and PostgreSQL for data storage.

- **API Design**: Follow RESTful conventions for new endpoints (e.g., `/api/v1/resource`).

- **Error Handling**: Include meaningful error messages and status codes.

- **Security**: Avoid hardcoding sensitive data; use environment variables.

- **Performance**: Optimize database queries and API responses where possible.

## Example Contribution Workflow

Let's say you want to fix a bug:

1. Find an issue in the [Issues](https://github.com/unsend/unsend/issues) tab.
2. Fork and clone the repo.
3. Create a branch: `git checkout -b fix/email-validation`.
4. Fix the bug in the codebase.
5. Test locally: Send a test email to ensure it works.
6. Commit: `git commit -m "fix: improve email address validation"`.
7. Push: `git push origin fix/email-validation`.
8. Open a PR with a description linking the issue.

## Community and Support

- **Discord**: Join our Discord server (see README for the link) to chat with contributors and maintainers.
- **GitHub Discussions**: Use the [Discussions](https://github.com/unsend/unsend/discussions) tab for ideas or questions.
- **Stuck?**: Open an issue or ask in Discord—we're here to help!

## Code of Conduct

We're committed to a welcoming and inclusive community:

- Be respectful and considerate in all interactions
- Avoid harassment, discrimination, or offensive language
- Focus on constructive feedback and collaboration

## Recognition

Every contributor matters! Your name will appear in the GitHub contributors list, and we'll shout out significant contributions on Discord or other channels.

## Questions?

Unsure where to start? Need clarification? Reach out via [GitHub Issues](https://github.com/unsend/unsend/issues) or Discord. We're excited to see what you bring to Unsend!

Thank you for contributing—let's build something awesome together!