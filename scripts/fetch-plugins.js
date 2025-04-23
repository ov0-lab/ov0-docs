//@ts-check
const { writeFileSync } = require('fs')
const { plugins } = require('../static/plugins.js')

/** @todo 获取git详细数据 */
plugins.map((plugin, index) => {
    if (!plugin.logo) {
        plugin.logo = '/img/plugin-default-logo.png'
    }
    if (!plugin.authors) {
        if (plugin.source[0]?.platform == 'gitee' || plugin.source[0]?.platform == 'github') {
            plugin.authors = [{ name: plugin.source[0].owner }]
        } else {
            plugin.authors = [{ name: 'unknown' }]
        }
    }
    return plugin
})

writeFileSync('./static/api/plugins.json', JSON.stringify(plugins), 'utf-8')

console.log('✔️ /api/plugins.json 可访问。')
