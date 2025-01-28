import { defineBuildConfig } from 'unbuild'
import { ADV_VIRTUAL_MODULES } from './node/config'

import pkg from './package.json'

export default defineBuildConfig({
  declaration: true,
  entries: [
    './node/index',
    './node/cli/index',
  ],
  clean: true,
  externals: [
    '@playwright/test',

    'mdast',

    ...Object.keys(pkg.dependencies),
    ...ADV_VIRTUAL_MODULES,
  ],
})
