# q-core

## Add to project

To add q-core to a project, add the following scripts to the package.json file of the project:

```jsonc
// package.json
{
    "postinstall": "yarn q:init",
    "q:add": "git submodule add https://github.com/authentiqagency/q-core.git && yarn install",
    "q:init": "test -d ./q-core/lib && exit 0 || git submodule init && yarn q:update",
    "q:dev": "cd q-core && yarn build:watch && cd ..",
    "q:update": "git submodule update && yarn q:build",
    "q:upgrade": "cd q-core && git checkout main && git pull && cd .. && yarn q:build",
    "q:build": "cd q-core && yarn install && yarn build && cd ..",
}
```

After adding the scripts to the package.json file, run the following command to add q-core to the project:

```bash
yarn q:add
```

**Add absolute path resolution**

```jsonc
// jsconfig.json
{
    "compilerOptions": {
        // ...
        "paths": {
            // ...
            "@core/*": ["./q-core/lib/*"]
        }
    }
}
```

```javascript
// jest.config.js
module.exports = {
    // ...
    moduleNameMapper: {
        // ...
        '^@core/(.*)$': '<rootDir>/q-core/lib/$1'
    }
}
```

**Add q-core to eslint ignore pattern:**

q-core comes with its own eslint config, therefore can be added to the ignore pattern of your project. Do not add it to .eslintignore, as linting won't work for q-core anymore.

```jsonc
// .eslintrc
{
    // ...
    "ignorePatterns": ["q-core"]
}
```

## Update to current version and rebuild

`yarn q:update`

## Upgrade to latest version and rebuild

`yarn q:upgrade`

## Start watcher for automatic building of changed files

`yarn q:dev`
