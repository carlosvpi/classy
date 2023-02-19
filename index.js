const styleNode = document.createElement('style')
styleNode.type = 'text/css'
document.head.appendChild(styleNode)
const sheet = styleNode.sheet

module.exports = (attrs, selector = '') => {
	const index = sheet.cssRules.length
	const className = `classy-${Math.random().toString(16).slice(2)}`
	const functionalAttrMap = new Map([])
	const style = Object.keys(attrs).reduce((acc, key) => {
		if (typeof attrs[key] === 'function') {
			attrs[key](value => {
				functionalAttrMap.set(key, value)
				const style = Object.keys(attrs).reduce((acc, key) => {
					if (typeof attrs[key] === 'function') {
						acc += `${key}: ${functionalAttrMap.get(key)};\n`
					} else {
						acc += `${key}: ${attrs[key]};\n`
					}
					return acc
				}, '')
				if (sheet.cssRules[index]) {
					sheet.removeRule(index)
				}
				sheet.insertRule(`.${className}${selector} {${style}}`, index)
			})
			if (!functionalAttrMap.has(key)) {
				throw new Error(`${key} needs to be defined at the moment of setting the style`)
			}
		} else {
			acc += `${key}: ${attrs[key]};\n`
		}
		return acc
	}, '')
	if (sheet.cssRules[index]) {
		sheet.removeRule(index)
	}
	sheet.insertRule(`.${className}${selector} {${style}}`, index)
	return className
}
