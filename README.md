# q-core

## Add to project

**Add npm/yarn scripts:**

```json
{
    "preinstall": "yarn q:init",
    "q:init": "test -d ./q-core/lib && exit 0 || git submodule init && yarn q:build",
    "q:upgrade": "cd q-core && git checkout main && git pull && cd .. && yarn q:build",
    "q:build": "cd q-core && yarn install && yarn build && cd ..",
}
```

**Add q-core as a git submodule:**

`git submodule add https://github.com/authentiqagency/q-core.git`

This will fetch the submodule, install its dependencies and build the library:

`yarn q:init`

**Add q-core as a local file dependency:**

`yarn add ./q-core`

## Upgrade to latest version and rebuild

`yarn q:upgrade`
