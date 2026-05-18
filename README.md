# ESLint Demo Project

This project demonstrates how to set up and run ESLint using the new Flat Config system (`eslint.config.mjs`) on a vanilla JavaScript application (`flashcard-app`).

## Running ESLint

To lint the demo project, run the following command from the root of this project:

```bash
npx eslint flashcard-app
```

### Automatically Fixing Issues

ESLint can automatically fix many common issues like missing semicolons, spacing problems. To apply these automatic fixes, append the `--fix` flag:

```bash
npx eslint flashcard-app --fix
```

## Configuration

This project is configured using ESLint v9's Flat Config system. You can view the configuration in `eslint.config.mjs`. It uses the `@eslint/js` recommended rules as a base, along with some custom overrides, such as `semi` and `eqeqeq`.
