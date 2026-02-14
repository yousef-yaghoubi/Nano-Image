import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { Favorite, Prompts, Users, PromptFavorite } from '@/models';
import { IFavorite, IUser } from '@/types/models';
import { PromptType } from '@/types/data';
import type { FilterQuery, SortOrder } from 'mongoose';
import { promptsQuerySchema } from '@/validation/DTO';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    // ۱. اعتبارسنجی با DTO
    let validatedData;
    try {
      validatedData = await promptsQuerySchema.validate({
        page: searchParams.get('page'),
        limit: searchParams.get('limit'),
        sort: searchParams.get('sort'),
        tags: searchParams.get('tags'),
        search: searchParams.get('search'),
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown validation error';
      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: 400 }
      );
    }

    const {
      page,
      limit,
      sort: sortParam,
      tags: rawTags,
      search,
    } = validatedData;
    const skip = (page - 1) * limit;

    // ۲. احراز هویت و پیدا کردن FavoriteId (بدون تغییر در منطق شما)
    const { userId: clerkId } = await auth();
    let favoriteId: string | null = null;

    if (clerkId) {
      const user = await Users.findOne({ clerkId })
        .select('_id')
        .lean<IUser | null>();
      if (user) {
        const favDoc = await Favorite.findOne({ userId: user._id })
          .select('_id')
          .lean<IFavorite | null>();
        favoriteId = favDoc?._id?.toString() ?? null;
      }
    }
    const where: FilterQuery<PromptType> = {};

    if (rawTags) {
      const tagsArray = rawTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      if (tagsArray.length > 0) where.tags = { $in: tagsArray };
    }

    if (search) {
      where.$or = [
        { title: { $regex: search, $options: 'i' } },
        { prompt: { $regex: search, $options: 'i' } },
      ];
    }

    // ۴. آماده‌سازی Sort
    const sort: Record<string, SortOrder> = {};
    if (sortParam === 'likes asc') sort.likes = 1;
    else if (sortParam === 'date desc') sort.createdAt = -1;
    else if (sortParam === 'date asc') sort.createdAt = 1;
    else sort.likes = -1; // Default: likes desc

    // ۵. اجرای کوئری‌ها
    const [total, promptsRaw] = await Promise.all([
      Prompts.countDocuments(where),
      Prompts.find(where)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean<PromptType[]>(),
    ]);

    let prompts = promptsRaw;

    // ۶. منطق isFavorited
    if (favoriteId && prompts.length > 0) {
      const promptIds = prompts.map((p) => p._id);
      const favoritedEntries = await PromptFavorite.find({
        favoriteId,
        promptId: { $in: promptIds },
      })
        .select('promptId')
        .lean();

      const favoritedSet = new Set(
        favoritedEntries.map((f) => f.promptId.toString())
      );

      prompts = prompts.map((p) => ({
        ...p,
        isFavorited: favoritedSet.has(p._id.toString()),
      })) as typeof promptsRaw;
    }

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      message: 'Prompts fetched successfully 🚀',
      data: prompts,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Fetch Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }

      // {
      //   success: true,
      //   message: 'Prompts fetched successfully 🚀',
      //   data: [
      //     {
      //       _id: '693491fadb012b0a89acc6ff',
      //       title: 'Urban Reflection in Dramatic Light',
      //       prompt: "Dramatic, ultra-realistic close-up in black and white with high-contrast cinematic lighting from the side, highlighting the contours of his face and beard, casting deep shadows. He wears round, reflective sunglasses. He gazes confidently upward into a dark void. The sunglasses reflect a city's towering skyline. The atmosphere is mysterious with a minimalist black background. Details in 4K. Keep the subject's exact facial structure, hair texture, the original photo.",
      //       image: 'https://cdn.bananaprompts.xyz/18973a18-e495-4d7c-b8aa-a7fc55767459/cb66879a-fcef-4010-ad28-5033521e664b.png',
      //       likes: 879,
      //       creatorId: '69347231d35b238694c04b1c',
      //       tags: [Array],
      //       isPremium: false,
      //       __v: 0,
      //       createdAt: '2025-12-06T20:28:42.334Z',
      //       updatedAt: '2025-12-14T19:39:41.393Z',
      //       imageBlur: 'https://cdn.bananaprompts.xyz/18973a18-e495-4d7c-b8aa-a7fc55767459/cb66879a-fcef-4010-ad28-5033521e664b.png'
      //     },
      //     {
      //       _id: '693491fadb012b0a89acc700',
      //       title: 'Retrato editorial masculino premium',
      //       prompt: 'Studio portrait of a confident man sitting on a modern beige armchair with wooden legs, leaning slightly forward with his hands together. He wears a dark navy blue dress shirt with the top buttons open, light beige slim-fit pants, and black loafers with tan soles. He has short dark brown hair styled with texture, a trimmed full beard, tanned skin, and an intense confident gaze directed at the camera. The background is minimalist light gray with a smooth gradient, evenly lit with soft natural studio lighting. The mood is cinematic and fashion editorial, with high realism and fine details. Shot with a 50mm lens at f/2.8, vertical framing, full-body composition.\r\n' +
      //         'the subject from the uploaded image, maintaining the exact real face, hairstyle, skin tone, and body identity unchanged.',
      //       image: 'https://cdn.bananaprompts.xyz/ae5f8289-1a58-4605-8d97-0ffa38b6a5cf/76bcf139-247c-40a9-adf1-a450be31a762.jpeg',
      //       likes: 440,
      //       creatorId: '69347231d35b238694c04b1c',
      //       tags: [Array],
      //       isPremium: false,
      //       __v: 0,
      //       createdAt: '2025-12-06T20:28:42.349Z',
      //       updatedAt: '2025-12-14T19:39:43.447Z',
      //       imageBlur: 'https://cdn.bananaprompts.xyz/ae5f8289-1a58-4605-8d97-0ffa38b6a5cf/76bcf139-247c-40a9-adf1-a450be31a762.jpeg'
      //     },
      //     {
      //       _id: '693491fadb012b0a89acc701',
      //       title: 'Submerged',
      //       prompt: 'Hyper-realistic, ultra-detailed close-up portrait showing only the left half of my face submerged in water, one eye in sharp focus, positioned on the far left of the frame, light rays creating caustic patterns on the skin, suspended water droplets and bubbles adding depth, cinematic lighting with soft shadows and sharp highlights, photorealistic textures including skin pores, wet lips, eyelashes, and subtle subsurface scattering, surreal and dreamlike atmosphere, shallow depth of field, underwater macro perspective. 3:4 aspect ratio',
      //       image: 'https://cdn.bananaprompts.xyz/2513bb4b-b97f-4488-9f3e-7cc8448f1568/c30a900e-8ba4-4a2d-ac99-d18eb216898d.png',
      //       likes: 342,
      //       creatorId: '69347231d35b238694c04b1c',
      //       tags: [Array],
      //       isPremium: false,
      //       __v: 0,
      //       createdAt: '2025-12-06T20:28:42.349Z',
      //       updatedAt: '2026-01-04T18:45:52.692Z',
      //       imageBlur: 'https://cdn.bananaprompts.xyz/2513bb4b-b97f-4488-9f3e-7cc8448f1568/c30a900e-8ba4-4a2d-ac99-d18eb216898d.png'
      //     },
      //     {
      //       _id: '693491fadb012b0a89acc702',
      //       title: 'Gini',
      //       prompt: 'Maintain the same face and person (use attached photo for accurate face\r\n' +
      //         '\r\n' +
      //         '‎Hyper-realistic cinematic Create an 8k photorealistic image using the attached photo. A close-up portrait of a woman with long, jet-black, slightly wind-swept hair falling across her face. Her striking, light-colored eyes gaze upwards and to the right, catching a sharp, diagonal beam of natural light that illuminates the high points of her cheekbone, nose, and plump, glossy, mauve-toned lips a slightly light weight silk',
      //       image: 'https://cdn.bananaprompts.xyz/95945df9-736c-4faf-8710-acee35cb47c3/db37e078-415c-41e3-be75-08d64fae3a3b.jpeg',
      //       likes: 313,
      //       creatorId: '69347231d35b238694c04b1c',
      //       tags: [Array],
      //       isPremium: false,
      //       __v: 0,
      //       createdAt: '2025-12-06T20:28:42.349Z',
      //       updatedAt: '2025-12-14T19:39:43.907Z',
      //       imageBlur: 'https://cdn.bananaprompts.xyz/95945df9-736c-4faf-8710-acee35cb47c3/db37e078-415c-41e3-be75-08d64fae3a3b.jpeg'
      //     },
      //     {
      //       _id: '693491fadb012b0a89acc703',
      //       title: 'A cinematic urban portrait',
      //       prompt: 'A cinematic urban portrait of me, keeping my real face unchanged. I am sitting casually on outdoor stone steps in front of a building entrance, leaning slightly forward with a confident and contemplative posture. My left elbow rests on my knee, with my hand raised to my temple in a thoughtful gesture, while my right arm hangs more loosely, with my hand extended downward in a relaxed position. My legs are bent naturally, spreading apart for a grounded and strong presence. My gaze is directed toward the camera, steady and intense, with a calm yet powerful expression. I am wearing a black outfit: a fitted turtleneck sweater layered under a black coat with a wide collar and subtle texture. The coat has a tailored yet modern look, with a slightly matte fabric that absorbs the light, creating depth. My trousers are also black, slim-fitted, completing the clean, monochromatic style. No visible accessories, emphasizing minimalism and sophistication.\r\n' +
      //         'The background shows part of an urban building with glass doors and warm interior lights softly glowing, adding contrast to the darker tones of my outfit. The lighting is warm and diffused, highlighting my face and upper body while creating soft shadows that add cinematic depth. The camera captures me slightly from below (low angle), emphasizing strength and presence, framed from the knees up. The focal length resembles a portrait lens around 50-85mm, producing natural proportions with a shallow depth of field that keeps me sharp against the softly blurred background. Style: cinematic, moody urban portrait, editorial fashion photography, minimalistic monochrome outfit, professional model vibe.',
      //       image: 'https://cdn.bananaprompts.xyz/3af490e3-bf8b-4fc2-a77f-33dfca4e5040/5dbf467c-003a-43d1-b3ec-c0e46b428c4a.jpeg',
      //       likes: 262,
      //       creatorId: '69347231d35b238694c04b1c',
      //       tags: [Array],
      //       isPremium: false,
      //       __v: 0,
      //       createdAt: '2025-12-06T20:28:42.349Z',
      //       updatedAt: '2025-12-14T19:39:44.180Z',
      //       imageBlur: 'https://cdn.bananaprompts.xyz/3af490e3-bf8b-4fc2-a77f-33dfca4e5040/5dbf467c-003a-43d1-b3ec-c0e46b428c4a.jpeg'
      //     },
      //     {
      //       _id: '693491fadb012b0a89acc704',
      //       title: 'Foto black tie',
      //       prompt: 'Uma foto realista com todos os traços e linhas idênticos ao da foto com um semblante imponente, em preto em branco, no traje de terno preto e gravata slim.',
      //       image: 'https://cdn.bananaprompts.xyz/e7cafee4-0124-4156-90e2-faad0e1e8b60/aad96207-11a9-4943-a8a5-6ede4d234f9f.jpeg',
      //       likes: 217,
      //       creatorId: '69347231d35b238694c04b1c',
      //       tags: [Array],
      //       isPremium: false,
      //       __v: 0,
      //       createdAt: '2025-12-06T20:28:42.349Z',
      //       updatedAt: '2025-12-14T19:39:44.407Z',
      //       imageBlur: 'https://cdn.bananaprompts.xyz/e7cafee4-0124-4156-90e2-faad0e1e8b60/aad96207-11a9-4943-a8a5-6ede4d234f9f.jpeg'
      //     },
      //     {
      //       _id: '693491fadb012b0a89acc705',
      //       title: 'Propt moto esportiva',
      //       prompt: 'Crie uma imagem minha [foto enviada em anexo] um retrato ultra-realista. Eu estou sentado em uma Moto esportiva preta brilhante em uma área ao ar livre contra o fundo de árvores verdes. Eu uso uma camiseta preta solta, jeans escuros soltos com dobras na parte inferior e tênis Nike preto e branco. Os acessórios usados incluem um relógio preto. Minha mão esquerda descansou casualmente em sua coxa, enquanto sua mão direita descansou na moto enquanto segurava um capacete preto brilhante com uma viseira transparente.\r\n' +
      //         'A moto parece detalhada com um motor grande, quadro forte e detalhes cromados brilhantes, acentuando a impressão moderna e poderosa. O fundo mostra árvores altas com luz natural suave, criando uma mistura equilibrada de sombra e luz. A expressão é calma e confiante, olhando diretamente para\r\n' +
      //         'a câmera. O estilo geral é cinematográfico e moderno, combinando a sensação de streetwear jovem com a presença de uma motocicleta arrojada. Alta resolução, estilo editorial fotorrealista.',
      //       image: 'https://cdn.bananaprompts.xyz/b19b46c2-89c0-499f-bccc-39e2dcb6ee59/e9313887-c3bd-4837-a411-d5cbf1e7d469.jpeg',
      //       likes: 204,
      //       creatorId: '69347231d35b238694c04b1c',
      //       tags: [Array],
      //       isPremium: false,
      //       __v: 0,
      //       createdAt: '2025-12-06T20:28:42.349Z',
      //       updatedAt: '2025-12-14T19:39:44.648Z',
      //       imageBlur: 'https://cdn.bananaprompts.xyz/b19b46c2-89c0-499f-bccc-39e2dcb6ee59/e9313887-c3bd-4837-a411-d5cbf1e7d469.jpeg'
      //     },
      //     {
      //       _id: '693491fadb012b0a89acc706',
      //       title: 'Studio Photography',
      //       prompt: 'Studio photography of a me in a black suit, black turtleneck and round sunglasses with translucent yellow lenses.\r\n' +
      //         'Vibrant orange background.\r\n' +
      //         'Unique poses from the front.',
      //       image: 'https://cdn.bananaprompts.xyz/68155dad-d783-427e-bb9e-b7254480bf27/6080b41d-5c16-40b8-b8f4-baf2d3722a75.jpeg',
      //       likes: 201,
      //       creatorId: '69347231d35b238694c04b1c',
      //       tags: [Array],
      //       isPremium: false,
      //       __v: 0,
      //       createdAt: '2025-12-06T20:28:42.350Z',
      //       updatedAt: '2025-12-14T19:39:44.884Z',
      //       imageBlur: 'https://cdn.bananaprompts.xyz/68155dad-d783-427e-bb9e-b7254480bf27/6080b41d-5c16-40b8-b8f4-baf2d3722a75.jpeg'
      //     },
      //     {
      //       _id: '693491fadb012b0a89acc707',
      //       title: 'Instinct and Spirit',
      //       prompt: "Create a realistic and emotional scene showing a man (use the provided image for accurate facial features) and a lion face to face in a moment of connection and respect. The man's eyes are closed, with a serene expression, while the lion gently rests its forehead and muzzle against his, conveying trust and a spiritual bond.\r\n" +
      //         'Both are standing on ground covered in light snow, with snowflakes gently falling. The man wears a dark coat and hair slightly tousled by the wind, and the lion displays a thick, majestic mane.\r\n' +
      //         'In the background, a cold, misty natural landscape with blurred mountains and gray tones reinforces the calm and powerful atmosphere.\r\n' +
      //         'The lighting is soft and diffuse, highlighting the textures of the skin, fur, and coat, creating a cinematic and poetic atmosphere.\r\n' +
      //         'The composition should convey friendship, courage, and harmony between man and nature.\r\n' +
      //         '\r\n' +
      //         'Suggested settings:\r\n' +
      //         'Style: Ultra-realistic, cinematic, 8K\r\n' +
      //         'Lighting: Soft, diffuse, natural winter light\r\n' +
      //         'Camera: Medium close-up, focus on expressions\r\n' +
      //         'Emotion: Connection, respect, tranquility\r\n' +
      //         'Setting: Falling snow, blurred background with mountains',
      //       image: 'https://cdn.bananaprompts.xyz/f4f238cc-bb8e-4716-bfde-51c2718d5984/7761e3e5-32c1-47a7-8dfa-9f650aec6af3.png',
      //       likes: 191,
      //       creatorId: '69347231d35b238694c04b1c',
      //       tags: [Array],
      //       isPremium: false,
      //       __v: 0,
      //       createdAt: '2025-12-06T20:28:42.350Z',
      //       updatedAt: '2025-12-14T19:39:45.124Z',
      //       imageBlur: 'https://cdn.bananaprompts.xyz/f4f238cc-bb8e-4716-bfde-51c2718d5984/7761e3e5-32c1-47a7-8dfa-9f650aec6af3.png'
      //     },
      //     {
      //       _id: '693491fadb012b0a89acc708',
      //       title: 'Untamed Spirit',
      //       prompt: "A cinematic, mid-length portrait, capturing a female figure with a strong and elegant presence, standing next to a horse. The subject faces the camera, with a direct and confident gaze. One hand gently holds the horse's halter or head, conveying a calm and powerful connection with the animal.\r\n" +
      //         '\r\n' +
      //         "She wears a long-sleeved shirt in a neutral tone (beige, khaki, or light gray), with the top buttons undone to create a V-neckline. The bottoms are earthy-colored pants (brown or khaki), complemented by a brown leather belt with a large, prominent gold buckle (possibly with the letter 'V'). A gold chain hangs from the belt loops, adding a touch of glamour. The look is adorned with multiple bracelets on both wrists, combining metals and natural materials.\r\n" +
      //         '\r\n' +
      //         'Her hair is long, with voluminous waves and a natural look, as if gently blown by the wind, framing her face. The makeup is natural yet defined, enhancing the beauty of her features. Beside her, a brown horse with a white marking on its face looks forward, in harmony with the figure.\r\n' +
      //         '\r\n' +
      //         'The background is an open field, such as a prairie or a valley, with a cloudy sky and the landscape in the background gently blurred, creating a sense of vastness. The lighting is natural and diffuse, typical of an overcast day, resulting in soft shadows and light that flatters the face and body.\r\n' +
      //         '\r\n' +
      //         'Camera Settings: Captured with a prime portrait lens (e.g., 85mm f/1.8 or 105mm f/1.4) on a full-frame camera for optimal compression and creamy bokeh. Aperture set between f/2.0 and f/2.8 to perfectly isolate the subject and horse from the background. ISO 100-200 for maximum image quality with abundant natural light. Shutter speeds of 1/400s to 1/800s ensure absolute sharpness and freeze any subtle movement of the hair or horse. The lighting is exclusively natural, taking advantage of the soft light of an overcast sky.\r\n' +
      //         '\r\n' +
      //         'Instructions for the "nano banana":\r\n' +
      //         '\r\n' +
      //         `"Please use the user's reference image to capture and apply all of their facial features, facial structure, eye color, skin tone, hair style, and color with maximum fidelity. The goal is to create a version of the user in this cinematic portrait. The clothing, accessories, the pose next to the horse, the confident expression, the diffuse natural lighting, and the open field setting should be rendered as described, creating a perfect fusion between the user's identity and the aesthetics of the image."`,
      //       image: 'https://cdn.bananaprompts.xyz/1a9193f2-4d4f-402a-b1fa-89f89b391554/75bdae76-e15a-4933-a487-ccc49acb5894.jpeg',
      //       likes: 189,
      //       creatorId: '69347231d35b238694c04b1c',
      //       tags: [Array],
      //       isPremium: false,
      //       __v: 0,
      //       createdAt: '2025-12-06T20:28:42.350Z',
      //       updatedAt: '2025-12-14T19:39:45.342Z',
      //       imageBlur: 'https://cdn.bananaprompts.xyz/1a9193f2-4d4f-402a-b1fa-89f89b391554/75bdae76-e15a-4933-a487-ccc49acb5894.jpeg'
      //     },
      //     {
      //       _id: '693491fadb012b0a89acc709',
      //       title: 'Mulher Elegante',
      //       prompt: 'Recrie essa cena usando minha foto enviada como referência, mantendo o mesmo enquadramento, pose, iluminação e estilo da imagem de exemplo.\r\n' +
      //         '\r\n' +
      //         'A composição deve mostrar um retrato feminino de meio corpo, com a modelo sentada e levemente inclinada para a frente. O braço direito deve cruzar o corpo, com a mão esquerda apoiada suavemente no braço oposto, transmitindo elegância e confiança.\r\n' +
      //         '\r\n' +
      //         'A expressão facial deve ser serena, confiante e levemente enigmática. O olhar deve estar direcionado à câmera, com os lábios suavemente fechados e postura firme.\r\n' +
      //         '\r\n' +
      //         'A roupa é composta por um conjunto escuro e sofisticado — blazer preto estruturado, usado sobre uma blusa preta justa. O cabelo deve estar solto, liso e bem alinhado, caindo sobre um dos ombros de forma natural.\r\n' +
      //         '\r\n' +
      //         'A iluminação deve ser de estúdio, com luz direcional suave e contrastada (estilo Rembrandt ou luz lateral), destacando o contorno do rosto, criando sombras elegantes e um degradê sutil no fundo.\r\n' +
      //         '\r\n' +
      //         'O fundo deve ser liso e neutro, em tons de cinza escuro, com profundidade leve e sem elementos de distração.\r\n' +
      //         '\r\n' +
      //         'O estilo final deve ser preto e branco, com contraste refinado, textura suave da pele e aparência realista de retrato editorial.\r\n' +
      //         '\r\n' +
      //         'Formato vertical (1080x1920), proporção retrato, qualidade fotográfica de estúdio profissional, acabamento cinematográfico e realista.',
      //       image: 'https://cdn.bananaprompts.xyz/076c11fd-41b9-4ff9-a31b-68d0d255186f/02723cbb-62e9-47ff-9c7e-54e642c6d94f.png',
      //       likes: 186,
      //       creatorId: '69347231d35b238694c04b1c',
      //       tags: [Array],
      //       isPremium: false,
      //       __v: 0,
      //       createdAt: '2025-12-06T20:28:42.350Z',
      //       updatedAt: '2025-12-14T19:39:45.561Z',
      //       imageBlur: 'https://cdn.bananaprompts.xyz/076c11fd-41b9-4ff9-a31b-68d0d255186f/02723cbb-62e9-47ff-9c7e-54e642c6d94f.png'
      //     },
      //     {
      //       _id: '693491fadb012b0a89acc70a',
      //       title: 'reflections in style',
      //       prompt: 'Use the uploaded photo to create an Ultra-realistic mirror selfie of a stylish man with glasses.\r\n' +
      //         'He is wearing a loose white sweater layered over a crisp white T-shirt, paired with dark blue denim jeans.\r\n' +
      //         'He holds a new modern iPhone 17 smartphone orange colour in one hand, partially covering his face, while his other hand rests casually in his pocket.\r\n' +
      //         '\r\n' +
      //         'The scene is set in warm indoor lighting, creating a cinematic, moody atmosphere with soft shadow”',
      //       image: 'https://cdn.bananaprompts.xyz/6a1be39f-1739-44c7-8dda-8a7e17b93b78/036f1a5f-928d-42f1-99c1-97d945a6c9c8.png',
      //       likes: 179,
      //       creatorId: '69347231d35b238694c04b1c',
      //       tags: [],
      //       isPremium: false,
      //       __v: 0,
      //       createdAt: '2025-12-06T20:28:42.350Z',
      //       updatedAt: '2025-12-14T19:39:45.812Z',
      //       imageBlur: 'https://cdn.bananaprompts.xyz/6a1be39f-1739-44c7-8dda-8a7e17b93b78/036f1a5f-928d-42f1-99c1-97d945a6c9c8.png'
      //     }
      //   ],
      //   pagination: {
      //     total: 905,
      //     totalPages: 76,
      //     currentPage: 1,
      //     hasNextPage: true,
      //     hasPrevPage: false
      //   }
      // }
    );
  }
}
