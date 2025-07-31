export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      console.log('FileReader result (first 100 chars):', result.substring(0, 100))
      
      // More robust base64 extraction that handles different data URL formats
      const colonIndex = result.indexOf(':')
      const commaIndex = result.indexOf(',')
      
      if (colonIndex === -1 || commaIndex === -1) {
        console.error('Invalid data URL format:', { colonIndex, commaIndex, resultLength: result.length })
        reject(new Error('Invalid data URL format'))
        return
      }
      
      // Extract base64 part after the comma, regardless of MIME type
      const base64 = result.substring(commaIndex + 1)
      console.log('Extracted base64 length:', base64.length)
      
      // Validate base64 format
      if (!base64 || base64.length === 0) {
        console.error('Empty base64 data')
        reject(new Error('Empty base64 data'))
        return
      }
      
      // More lenient base64 validation - allow whitespace that might be present
      const cleanBase64 = base64.replace(/\s/g, '')
      const base64Pattern = /^[A-Za-z0-9+/]*={0,2}$/
      if (!base64Pattern.test(cleanBase64)) {
        console.error('Invalid base64 format:', {
          originalLength: base64.length,
          cleanLength: cleanBase64.length,
          firstChars: cleanBase64.substring(0, 20),
          lastChars: cleanBase64.substring(cleanBase64.length - 20)
        })
        reject(new Error('Invalid base64 format'))
        return
      }
      
      console.log('Base64 validation passed, resolving')
      resolve(cleanBase64)
    }
    reader.onerror = (error) => {
      console.error('FileReader error:', error)
      reject(error)
    }
  })
}
