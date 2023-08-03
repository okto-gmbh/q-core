# q-core

## Add to project

To add q-core to a project, add the following scripts to the package.json file of the project:

```jsonc
// package.json
{
    "q:add": "git submodule add https://github.com/okto-gmbh/q-core.git && yarn install",
    "q:init": "git submodule init",
    "q:update": "git submodule update",
    "q:upgrade": "cd q-core && git checkout main && git pull && cd .."
}
```

After adding the scripts to the package.json file, run the following command to add q-core to the project:

```bash
yarn q:add
```

## Add absolute path resolution

```jsonc
// tsconfig.json
{
    "compilerOptions": {
        // ...
        "paths": {
            // ...
            "@core/*": ["./q-core/src/*"]
        }
    }
}
```

## Update to current version and rebuild

`yarn q:update`

## Upgrade to latest version and rebuild

`yarn q:upgrade`
