import fetch from 'node-fetch';

const handler = async (m, { conn, text }) => {
    if (!text) {
        console.log('No song name provided.');
        throw '*Please enter a song name*';
    }

    m.react('🎶');
    await conn.sendMessage(m.chat, { text: 'Loading...' });

    const query = encodeURIComponent(text);
    let res = `${APIs.ryzen}/api/downloader/spotify?url=${query}`;

    let doc = {
        audio: {
            url: res
        },
        mimetype: 'audio/mpeg',
        ptt: true,
        waveform: [100, 0, 100, 0, 100, 0, 100],
        fileName: "Aetherz.mp3",
        contextInfo: {
            mentionedJid: [m.sender],
            externalAdReply: {
                title: "↺ |◁   II   ▷|   ♡",
                body: `Now playing: ${text}`,
                thumbnailUrl: 'https://telegra.ph/file/ac3fdd3632f24b6d70f95.jpg',
                sourceUrl: null,
                mediaType: 1,
                renderLargerThumbnail: false
            }
        }
    };

    await conn.sendMessage(m.chat, doc, { quoted: m });
};

handler.help = ['spotifysongs'];
handler.tags = ['downloader'];
handler.command = /^(spotifysongs)$/i;

export default handler;