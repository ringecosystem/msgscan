async function loop(fn, interval = 1000) {
  try {
    await fn()
    await new Promise((resolve) => setTimeout(resolve, interval))
    await loop(fn, interval)
  } catch (error) {
    console.error(error)
    console.log(`retrying ${fn.name} in 5 seconds...`)
    await new Promise((resolve) => setTimeout(resolve, 5000))
    await loop(fn, interval)
  }
}

export { loop }