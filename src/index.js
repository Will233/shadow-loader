const fs = require('fs')
const { getOptions } = require('loader-utils')
const validateOptions = require('schema-utils')

const schema = {
  type: 'object',
  properties: {
    test: {
      type: 'string'
    },
    options: {
      isDebug: 'boolean',
      rules: 'array'
    }
  }
}
module.exports  = function(source) {
  this.cacheable(false)
  const options = getOptions(this) || {}
  validateOptions(schema, options, 'Shadow Loader');
  const { rules, isDebug }  = options
  const rule = rules.find(i => i.reg.test(this.resource)) 
  if (rule) {
    const newPath = this.resource.replace(rule.reg, rule.new)
    if (isDebug) {
      console.log('[shadow-loader] Original resource path =>', this.resource)
      console.log('[shadow-loader] New resource path =>', newPath)
    }
    try {
      return fs.readFileSync(newPath)
    } catch(e) {
      console.error('[shadow-loader] Error', e)
      return source
    }
  }
  return source
}