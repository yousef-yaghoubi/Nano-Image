'use server';

import { getBaseUrl } from '@/lib/getBaseUrl';

export async function SendDataToAI(file: string, prompt: string) {
  //   const file = await fileToBase64(file);

  const res = await fetch(`${getBaseUrl()}/api/generate-image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      imageBase64: file,
    }),
  });

  const data = await res.json();
  if (data.imageBase64) {
    console.log('Generated image Base64:', data.imageBase64);
    const img = new Image();
    img.src = 'data:image/jpeg;base64,' + data.imageBase64;
    return img.src;
  } else {
    console.error(data.error);
  }
}
