# Development Guide

## Code Quality Standards

This project maintains high code quality standards using automated tools and pre-commit hooks.

### Tools in Use

- **ESLint**: Static code analysis for JavaScript/TypeScript
- **Prettier**: Code formatting
- **Husky**: Git hooks management
- **lint-staged**: Run linters on staged files

## Code Quality Rules

### ESLint Configuration

Our ESLint setup enforces:

**Error Level:**
- `no-console`: Console statements are not allowed (use proper logging)
- `no-debugger`: Debugger statements are not allowed
- `@typescript-eslint/no-unused-vars`: Unused variables are errors (prefix with `_` to ignore)

**Warning Level:**
- `@typescript-eslint/no-explicit-any`: Using `any` type should be avoided when possible

**Import Organization:**
- Imports are automatically sorted alphabetically
- Groups: builtin → external → internal → parent → sibling → index → object → type
- Blank lines between groups

### Prettier Configuration

Code is formatted with:
- Single quotes for strings
- Semicolons required
- 2-space indentation
- 100 character line width
- ES5 trailing commas
- LF line endings

## Running Code Quality Tools

### Linting

```bash
# Check for linting errors
npm run lint

# Automatically fix linting errors
npm run lint:fix
```

**Note:** We use ESLint 9 with flat config (.eslintrc.json). Due to Next.js's limited ESLint 9 support, we run ESLint directly rather than through `next lint`.

### Type Checking

```bash
# Run TypeScript type checking
npm run typecheck
```

### Formatting

```bash
# Format all files
npm run format

# Check formatting without making changes
npm run format:check
```

### Combined Quality Check

```bash
# Run linting (with auto-fix) and formatting together
npm run quality
```

## Pre-commit Hooks

Git pre-commit hooks are automatically installed via Husky and will:

1. Run on every `git commit`
2. Lint and format only staged files (via lint-staged)
3. Prevent commit if there are unfixable errors

**What gets checked:**
- `.js`, `.jsx`, `.ts`, `.tsx` files: ESLint + Prettier
- `.json`, `.md`, `.css`, `.scss` files: Prettier only

### Bypassing Pre-commit Hooks (Not Recommended)

If absolutely necessary, you can skip hooks with:
```bash
git commit --no-verify
```

**Note:** This is discouraged as it defeats the purpose of maintaining code quality.

## Best Practices

### TypeScript

- Avoid using `any` type - use proper types or `unknown`
- Prefix unused variables with `_` (e.g., `_unusedParam`)
- Always define return types for functions

### Console Logging

- Use proper logging libraries in production code
- For debugging, use conditional logging:
  ```typescript
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('Debug info');
  }
  ```

### Imports

- Imports will be automatically organized on save/commit
- No need to manually sort imports

### Code Reviews

Before submitting a PR:
1. Run `npm run quality` to ensure code meets standards
2. Fix any remaining errors or warnings
3. Verify all pre-commit hooks pass

## IDE Integration

### VS Code

Install recommended extensions:
- **ESLint** (`dbaeumer.vscode-eslint`)
- **Prettier** (`esbenp.prettier-vscode`)

Add to your `.vscode/settings.json`:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

## Tool Configuration Details

### ESLint 9 with Flat Config

This project uses **ESLint 9** with the `.eslintrc.json` configuration format. We've configured it to:
- Work directly with ESLint CLI (not through Next.js's wrapper)
- Support TypeScript via `@typescript-eslint/*` plugins
- Enforce import ordering and organization
- Prevent console statements and debugger usage in production

### Prettier + ESLint Integration

ESLint handles code quality while Prettier handles formatting. They work together through `lint-staged` during pre-commit hooks.

## Troubleshooting

### Pre-commit hook not running

```bash
# Reinstall hooks
npm run prepare
```

### Linting errors in node_modules

The configuration ignores `node_modules/`, `.next/`, and `dist/`. If you see errors there, check your ESLint cache:
```bash
rm -rf .eslintcache
```

### Prettier and ESLint conflicts

Our configuration is designed to work harmoniously. If you encounter conflicts:
1. Prettier handles formatting
2. ESLint handles code quality rules
3. Run `npm run quality` to apply both

### ESLint and Next.js

We run ESLint directly (not through `next lint`) because Next.js 14 has limited ESLint 9 support. All linting still works correctly for Next.js and React code.

## Contributing

All code contributions must:
- Pass ESLint checks
- Be formatted with Prettier
- Pass pre-commit hooks
- Follow the established patterns in the codebase

Thank you for maintaining our code quality standards!
