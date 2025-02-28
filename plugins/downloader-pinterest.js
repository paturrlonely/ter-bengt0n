import fetch from "node-fetch";
import baileys from "@whiskeysockets/baileys";

const { generateWAMessageContent, generateWAMessageFromContent, proto } = baileys;

const handler = async (m, { usedPrefix, command, conn, args }) => {
  if (!args[0]) throw `🚩 Contoh Penggunaan:\n${usedPrefix}${command} kucing lucu`;
  m.reply("🔍 Mencari gambar, harap tunggu...");

  try {
    const query = encodeURIComponent(args.join(" "));
    const response = await fetch(
      `https://api.agatz.xyz/api/pinsearch?message=${query}`
    );
    const json = await response.json();
    if (!json || !json.data || !Array.isArray(json.data) || json.data.length === 0) {
      return m.reply("❌ Error: Gambar tidak ditemukan!");
    }

    const images = json.data.slice(0, Math.min(10, json.data.length));
    const senderName = await conn.getName(m.sender);
    const push = [];

    async function createImage(url) {
      const { imageMessage } = await generateWAMessageContent(
        { image: { url } },
        { upload: conn.waUploadToServer }
      );
      return imageMessage;
    }

    for (const image of images) {
      push.push({
        body: { text: image.pin }, 
        footer: { text: global.namebot || "Bot WhatsApp" },
        header: {
          title: image.grid_title || "Gambar Pinterest",
          hasMediaAttachment: true,
          imageMessage: await createImage(image.images_url),
        },
        nativeFlowMessage: {},
      });
    }

    const msg = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2,
            },
            interactiveMessage: {
              body: { text: `📸 *Total Hasil*: ${images.length}` },
              footer: { text: `📢 *Hasil Pencarian untuk:* ${senderName}` },
              header: { hasMediaAttachment: false },
              carouselMessage: { cards: [...push] },
            },
          },
        },
      },
      { quoted: m }
    );

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
  } catch (error) {
    console.error(error);
    m.reply(`❌ *Terjadi kesalahan!*\n\n📌 *Error:* ${error.message}`);
  }
};

handler.help = ["pinterest2 <kata kunci>"];
handler.tags = ["internet", "downloader"];
handler.command = /^(pinterest2|pin2)$/i;
handler.limit = true;

export default handler;