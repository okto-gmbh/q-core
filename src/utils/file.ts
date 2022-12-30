export const downloadFile = (file: Blob, filename: string) => {
    const url = window.URL.createObjectURL(file)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.setAttribute('download', filename)
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
}

export const fileToBase64 = (file: Blob) =>
    new Promise((resolve) => {
        const reader = new FileReader()
        reader.addEventListener(
            'load',
            () =>
                resolve(
                    Buffer.from(reader.result as ArrayBuffer).toString('base64')
                ),
            false
        )
        reader.readAsArrayBuffer(file)
    })

export const getImageDimensions = (url: string) =>
    new Promise((resolve) => {
        const img = new window.Image()
        img.onload = () => {
            resolve({ height: img.height, width: img.width })
        }
        img.src = url
    })

export const dataUrlToBase64 = (dataUrl: string) =>
    dataUrl.substring(dataUrl.toString().indexOf(',') + 1)

export const dataUrlToBlob = async (dataUrl: string) => {
    const res = await fetch(dataUrl)
    return await res.blob()
}

export const base64ToDataUrl = (base64: string, contentType: string) =>
    `data:${contentType};base64,${base64}`
