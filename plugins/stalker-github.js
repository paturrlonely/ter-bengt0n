import fetch from 'node-fetch';

const handler = async (m, { text, usedPrefix, command, conn }) => {
    if (!text) throw `*Example:* ${usedPrefix + command} aetherzcode`;
    try {
        let json = await fetch(`${APIs.ryzen}/api/stalk/github?username=${text}`).then(res => res.json());

        if (!json || !json.login) {
            throw 'Error: User not found or invalid data received from API.';
        }

        let caption = `⦿  *G I T H U B - S T A L K*\n\n`;
        caption += `◦  *Name* : ${json.name || 'N/A'}\n`;
        caption += `◦  *Username* : ${json.login}\n`;
        caption += `◦  *ID* : ${json.id}\n`;
        caption += `◦  *NodeId* : ${json.node_id}\n`;
        caption += `◦  *Followers* : ${json.followers}\n`;
        caption += `◦  *Following* : ${json.following}\n`;
        caption += `◦  *Bio* : ${json.bio}\n`;
        caption += `◦  *Company* : ${json.company || 'N/A'}\n`;
        caption += `◦  *Public Repos* : ${json.public_repos}\n`;
        caption += `◦  *Create At* : ${json.created_at}\n`;
        caption += `◦  *Update At* : ${json.updated_at}\n`;
        caption += `◦  *Url* : ${json.html_url}\n`;

        await conn.relayMessage(m.chat, {
            extendedTextMessage: {
                text: caption,
                contextInfo: {
                    externalAdReply: {
                        title: wm,
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnailUrl: json.avatar_url,
                        sourceUrl: json.html_url
                    }
                },
                mentions: [m.sender]
            }
        }, {});
    } catch (e) {
        throw `Error: ${e}`;
    }
};

handler.help = ['ghstalk <username>'];
handler.tags = ['stalk'];
handler.command = /^(ghstalk|githubstalk)$/i;

export default handler;