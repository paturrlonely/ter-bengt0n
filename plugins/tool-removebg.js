import { removeBackgroundFromImageUrl } from 'remove.bg'
import uploadImage from '../lib/uploadImage.js'
let handler = async (m, { conn, usedPrefix, command }) => {
    try {
        let q = m.quoted ? m.quoted: m
        let mime = (q.msg || q).mimetype || ''
        if (!mime) throw 'Fotonya Mana?'
        if (!/image\/(jpe?g|png)/.test(mime)) throw `Tipe ${mime} tidak didukung!`
        m.reply(wait)
        let img = await q.download()
        let url = await uploadImage(img)
        let out = API('lann', '/api/tools/removebg', { img: url }, 'apikey')
        await conn.sendFile(m.chat, out, 'out.png', '*DONE (≧ω≦)ゞ*', m)
    } catch {
        let q = m.quoted ? m.quoted: m
        let mime = (q.msg || q).mimetype || ''
        if (!mime) throw 'Fotonya Mana?'
        if (!/image\/(jpe?g|png)/.test(mime)) throw `Tipe ${mime} tidak didukung!`
        m.reply(wait)
        let img = await q.download()
        let url = await uploadImage(img)
        let out = await nobg(url)
        await conn.sendFile(m.chat, out, 'out.png', '*DONE (≧ω≦)ゞ*', m)
    }
}
handler.help = ['removebg']
handler.tags = ['tools', 'premium']
handler.command = /^(removebg|nobg)$/i
handler.premium = false
export default handler

async function nobg(url) {
    try {
    const result = await removeBackgroundFromImageUrl({
      url,
      apiKey: apikey.getRandom(),
      size: "regular",
      type: "auto",
    });
    return Buffer.from(result.base64img, "base64");
  } catch (e) {
    return {
        status: false,
        error: e
    }
  }
}

const apikey = [
    't4DJWibUPdxTbCiZs6wXUTMB',
    'Divb33Vh3YANNFJMPkv4QJs3',
    '61N7EMLJURGuTdYpavHwkWTC'
]