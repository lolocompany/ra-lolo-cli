[![npm version](https://img.shields.io/npm/v/@lolocompany/ra-lolo-cli)](https://www.npmjs.com/package/@lolocompany/ra-lolo-cli)

# ra-lolo-cli

`ra-lolo-cli` is a command-line tool for generating React-Admin resources dynamically based on JSON schemas. It simplifies the creation of components and views for React-Admin projects by automating the resource generation process.

---

## Features

- **Dynamic Resource Generation**: Automatically generates React-Admin fields and views based on JSON schemas.
- **Customizable Output**: Generated files are clean and modular, allowing users to modify implementations manually as needed. This flexibility ensures that custom business logic can be added post-generation without restrictions.
- **Interactive CLI**: Prompts for resources to be generated.

---

## Prerequisites

Before using `ra-lolo-cli`, ensure the following requirements are met:

1. **Node.js**: Make sure Node.js (v16 or above) is installed on your system.
2. **React-Admin Project**: This CLI is designed to work with React-Admin version 5.

---

## Installation

To install and use the CLI globally:

```bash
npm install -g @lolocompany/ra-lolo-cli
```

Or you can run it without installation using `npx`:

```bash
npx @lolocompany/ra-lolo-cli
```

---

## Usage

To generate resources, run the following command in your project directory:

```bash
npx @lolocompany/ra-lolo-cli generate
```

The CLI will prompt you to enter the resources you want to generate. You can provide a comma-separated list of resource names (e.g., `users, posts, comments`).

---

## Environment Variables

The following environment variables need to be set for `ra-lolo-cli` to function properly:

### Required Variables

| Variable Name  | Description                                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| `LO_API_KEY` | The LoLo API key for authentication.[Documentation](https://docs.lolo.company/docs/lolo-authentication) |
| `LO_API`     | The base URL used to create your CRUD 4 app.                                                         |

### Example `.env` File

Create a `.env` file in the root directory of your project with the following content:

```env
LO_API_KEY=your-lolo-api-key
LO_API=https://your-crud4-app-base-url
```

---

## Customizable Output

Once the CLI generates the resource files, you can customize them manually to suit your specific needs. The generated code is designed to be clean and modular, making it easy to:

- Add custom validation or formatting logic.
- Modify input and output components for your resources.
- Adjust layouts or data fetching methods.

This approach ensures you have full control over the implementation, allowing the generated files to serve as a starting point rather than a rigid template.

---

## Troubleshooting

If you encounter any issues:

- Ensure all environment variables are correctly set.
- Verify the LoLo API key is valid and the base URL is accessible.
- Check that you are running the CLI within a valid React-Admin project.

For additional support, feel free to open an issue on the [GitHub repository](#).

---

## Contribution

Contributions are welcome! If you'd like to add new features or fix bugs, please fork the repository and submit a pull request.

---

Happy coding! 🚀
