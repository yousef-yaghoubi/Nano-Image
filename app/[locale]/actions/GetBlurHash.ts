import { getPlaiceholder } from 'plaiceholder';

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GetBlurData(
  src: string,
  retries = 3,
  timeout = 10000
): Promise<{ blurDataURL: string }> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const res = await fetch(src, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const buffer = Buffer.from(await res.arrayBuffer());
      const { base64 } = await getPlaiceholder(buffer);

      return {
        blurDataURL: base64,
      };
    } catch (error) {
      const isLastAttempt = attempt === retries - 1;
      
      if (isLastAttempt) {
        throw error;
      }

      // Exponential backoff: wait 1s, 2s, 4s...
      const delay = Math.pow(2, attempt) * 1000;
      console.warn(
        `⚠️ Attempt ${attempt + 1}/${retries} failed for ${src}, retrying in ${delay}ms...`
      );
      await sleep(delay);
    }
  }

  throw new Error('All retry attempts failed');
}
