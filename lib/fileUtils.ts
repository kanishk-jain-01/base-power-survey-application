export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      
      // More robust base64 extraction that handles different data URL formats
      const colonIndex = result.indexOf(':')
      const commaIndex = result.indexOf(',')
      
      if (colonIndex === -1 || commaIndex === -1) {
        reject(new Error('Invalid data URL format'))
        return
      }
      
      // Extract base64 part after the comma, regardless of MIME type
      const base64 = result.substring(commaIndex + 1)
      
      // Validate base64 format
      if (!base64 || base64.length === 0) {
        reject(new Error('Empty base64 data'))
        return
      }
      
      // More lenient base64 validation - remove whitespace and validate
      const cleanBase64 = base64.replace(/\s/g, '')
      const base64Pattern = /^[A-Za-z0-9+/]*={0,2}$/
      if (!base64Pattern.test(cleanBase64)) {
        reject(new Error('Invalid base64 format'))
        return
      }
      
      resolve(cleanBase64)
    }
    reader.onerror = (error) => reject(error)
  })
}
