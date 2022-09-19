# q-core

## Add to project

`git submodule add https://github.com/authentiqagency/q-core.git`

**Add npm/yarn scripts:**

```json
// package.json
{
    "postinstall": "yarn q:init",
    "q:init": "test -d ./q-core/lib && exit 0 || git submodule init && yarn q:update",
    "q:dev": "cd q-core && yarn build:watch && cd ..",
    "q:update": "git submodule update && yarn q:build",
    "q:upgrade": "cd q-core && git checkout main && git pull && cd .. && yarn q:build",
    "q:build": "cd q-core && yarn install && yarn build && cd ..",
}
```

**Add absolute path resolution**

```json
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

**Add q-core as a git submodule:**

`git submodule add https://github.com/authentiqagency/q-core.git`

This will fetch the submodule, install its dependencies and build the library:

`yarn q:init`

**Add q-core to eslint ignore pattern:**

q-core comes with its own eslint config, therefore can be added to the ignore pattern of your project. Do not add it to .eslintignore, as linting won't work for q-core anymore.

```json
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
