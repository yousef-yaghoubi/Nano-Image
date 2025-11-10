import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const base64Image = body.imageBase64 as string | undefined;
    const prompt = body.prompt as string | undefined;
    const mimeType = (body.mimeType as string | undefined) || 'image/jpeg';

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }
    if (!base64Image) {
      return NextResponse.json({ error: 'Image Base64 is required' }, { status: 400 });
    }
    const content = [
      { text: prompt },
      {
        inlineData: {
          data: base64Image,
        },
      },
    ];

    const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
    // const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image' });

    const result = await genAI.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: content,
    });

    const responseText = result.response.text();

    console.log(result);
    if (!responseText) {
      return NextResponse.json({ error: 'No response generated' }, { status: 500 });
    }

    return NextResponse.json({ text: responseText });
  } catch (err) {
    console.error('Error generating content:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
