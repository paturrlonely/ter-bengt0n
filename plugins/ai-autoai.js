/* JANGAN HAPUS WM INI MEK
SCRIPT BY © AETHERZCODE
•• contacts: (6285798045817)
•• instagram: @aetherz17_
•• (github.com/aetherzcode) 
*/
import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  conn.sessionAI = conn.sessionAI || {};

  if (!text) throw `🚩 ${usedPrefix + command} *enable/disable*`;

  if (text === "enable") {
    conn.sessionAI[m.sender] = { sessionChat: [] };
    m.reply("Success create sessions chat!");
  } else if (text === "disable") {
    delete conn.sessionAI[m.sender];
    m.reply("Success delete sessions chat!");
  }
};

handler.before = async (m, { conn }) => {
  conn.sessionAI = conn.sessionAI || {};
  if (m.isBaileys && m.fromMe) return;
  if (!m.text) return;
  if (!conn.sessionAI[m.sender]) return;
  if ([".", "#", "!", "/", "\\"].some(prefix => m.text.startsWith(prefix))) return;

  if (conn.sessionAI[m.sender] && m.text) {
    const previousMessages = conn.sessionAI[m.sender].sessionChat || [];
    /**
     * @description Ubah prompt ini sesuai dengan keinginanmu.
     * @note Usahakan memberikan logika yang masuk akal dan mudah dipahami!
     */
    const messages = [
      { role: "system", content: "kamu adalah AETHERZ, Seorang Asisten pribadi yang di buat oleh AETHER yang siap membantu kapan pun!" },
      { role: "assistant", content: `Saya AETHERZ, asisten pribadi yang siap membantu kamu kapan pun! Apa yang bisa saya bantu hari ini?` },
      ...previousMessages.map((msg, i) => ({ role: i % 2 === 0 ? 'user' : 'assistant', content: msg })),
      { role: "user", content: m.text }
    ];

    try {
      const chat = async (message) => {
        return new Promise(async (resolve, reject) => {
          try {
            const params = {
              message: message,
              apikey: lann // Ganti dengan API key Anda
            };
            const { data } = await axios.post('https://api.betabotz.eu.org/api/search/openai-custom', params);
            resolve(data);
          } catch (error) {
            reject(error);
          }
        });
      };

      let res = await chat(messages);
      if (res && res.result) {
        await m.reply(res.result);
        conn.sessionAI[m.sender].sessionChat = [
          ...conn.sessionAI[m.sender].sessionChat,
          m.text,
          res.result
        ];
      } else {
        m.reply("Kesalahan dalam mengambil data");
      }
    } catch (e) {
      throw e;
    }
  }
};

handler.command = ['autoai'];
handler.tags = ['ai'];
handler.help = ['autoai'].map(a => a + ' *enable/disable*');
handler.premium = true;

export default handler;