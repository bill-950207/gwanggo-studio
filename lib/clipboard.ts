export async function copyToClipboard(text: string): Promise<void> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      // Fallback for older browsers
      const el = document.createElement('textarea')
      el.value = text
      el.style.position = 'absolute'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
