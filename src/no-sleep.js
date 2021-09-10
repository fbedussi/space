let wakeLock = null

export const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request('screen')
  } catch (err) {
  }
}

export const releaseWakeLock = () => {
  if (wakeLock !== null) {
    wakeLock.release()
      .then(() => {
        wakeLock = null
      })
  }
}
