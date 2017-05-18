export default function (target, value = 1) {
  function increment ({ state, props, resolve }) {
    if (!resolve.isTag(target, 'state', 'props')) {
      throw new Error('Cerebral operator.increment: You have to use the STATE or PROPS TAG as first argument')
    }

    let resolvedValue = resolve.value(value)

    if (!Number.isInteger(resolvedValue)) {
      throw new Error('Cerebral operator.increment: You must increment by integer values')
    }

    const invalidStateMsg = 'Cerebral operator.increment: You must increment integer values'
    if (target.type === 'state') {
      const targetPath = resolve.path(target)
      const toIncrement = state.get(targetPath)

      if (!Number.isInteger(toIncrement)) {
        throw new Error(invalidStateMsg)
      }

      const incremented = toIncrement + resolvedValue
      state.set(targetPath, incremented)
    } else {
      const result = Object.assign({}, props)
      const parts = resolve.path(target).split('.')
      const key = parts.pop()
      const targetObj = parts.reduce((target, key) => {
        return (target[key] = Object.assign({}, target[key] || {}))
      }, result)

      if (!Number.isInteger(targetObj[key])) {
        throw new Error(invalidStateMsg)
      }

      targetObj[key] += resolvedValue

      return result
    }
  }

  increment.displayName = `operator.increment(${String(target)}, ${String(value)})`

  return increment
}
