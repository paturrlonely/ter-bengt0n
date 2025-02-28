import axios from "axios";

let handler = async (m, { args, command, conn }) => {
  let txt = args.join(" ");
  if (!txt) return m.reply("*Mana Prompt Nya*.");

  const parts = txt.split(" ");
  const isR1 = parts[0].toLowerCase() === "r1";

  let model = isR1 ? "deepseek-ai/DeepSeek-R1" : "deepseek-ai/DeepSeek-V3";
  let query = isR1 ? parts.slice(1).join(" ") : txt;

  if (!query) return m.reply("*Masuk Dalam Mode Deepthnik Mana Prompt Nya*'.");

  try {
    const response = await axios.post(
      "https://api.blackbox.ai/api/chat",
      {
        messages: [{ content: query, role: "user" }],
        model,
        max_tokens: "1024",
      },
      { headers: { "Content-Type": "application/json" } }
    );

    let data = response.data;
    let cleanText = data.replace(/\*\*/g, "*").trim();

    let message = {
      image: { url: "https://files.catbox.moe/jgxtyn.jpg" },
      caption: cleanText,
    };

    await conn.sendMessage(m.chat, message);
  } catch (error) {
    console.error(error);
    m.reply("Error.");
  }
};

handler.help = ["deepseek"];
handler.command = ["deepseek"];
handler.tags = ['ai']

export default handler;