export default async function handler(req, res) {
  // Vercel serverless function
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text, lang } = req.body;

    const prompt =
      lang === "ua"
        ? `Згенеруй чіткий та професійний опис Pull Request українською мовою з такою структурою:
- Коротко
- Що зроблено
- Навіщо
- Як перевірити
- Можливі ризики

Ось вхідні дані:
${text}`
        : `Generate a clear and professional Pull Request description with the following structure:
- Summary
- What was done
- Why
- How to test
- Possible risks

Input:
${text}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Bearer \${process.env.OPENAI_API_KEY}\`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      }),
    });

    const data = await response.json();

    res.status(200).json({
      result: data.choices[0].message.content,
    });
  } catch (error) {
    res.status(500).json({ error: "AI generation failed" });
  }
}
