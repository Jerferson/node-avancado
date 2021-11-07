import { addAlias } from 'module-alias'
import { resolve } from 'path/posix'

addAlias('@', resolve('dist'))
