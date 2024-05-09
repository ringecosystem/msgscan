async function loopDo(fn, interval = 1000) {
  try {
    await fn()
    await new Promise((resolve) => setTimeout(resolve, interval))
    await loopDo(fn, interval)
  } catch (error) {
    console.error(error)
    console.log(`retrying ${fn.name} in 5 seconds...`)
    await new Promise((resolve) => setTimeout(resolve, 5000))
    await loopDo(fn, interval)
  }
}

export { loopDo }
