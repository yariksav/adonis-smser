'use strict'

/*
 * adonis-smser
 *
 * (c) Savaryn Yaroslav <yariksav@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const path = require('path')

module.exports = async (cli) => {
  try {
    await cli.copy(path.join(__dirname, 'examples/config.js'), path.join(cli.helpers.configPath(), 'smser.js'))
    cli.command.completed('create', 'config/smser.js')
  } catch (error) {
    console.log(error)
  }
}
