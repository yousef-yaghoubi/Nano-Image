import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Favorite, PromptFavorite, Users } from '@/models';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  // ----------------------- 1. CHECK SECRET -----------------------
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response('Missing CLERK_WEBHOOK_SECRET', { status: 500 });
  }

  // ----------------------- 2. HEADERS -----------------------
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 });
  }

  // ----------------------- 3. GET RAW BODY (CRITICAL FIX) -----------------------
  // ⚠️ Must read as text first to preserve exact structure for verification
  const payload = await req.text();

  const wh = new Webhook(webhookSecret);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }

  // ----------------------- 4. PROCESS EVENT -----------------------
  // Connect to DB only AFTER verification passes
  await dbConnect();

  const eventType = evt.type;
  console.log(`Webhook verified. Event Type: ${eventType}`);

  try {
    switch (eventType) {
      case 'user.created': {
        const { id, email_addresses, image_url } = evt.data;

        // if (!email_addresses || email_addresses.length === 0) {
        //   return new Response('No email found', { status: 400 });
        // }

        // Use findOneAndUpdate with upsert=true.
        // This handles "creation" AND "duplicates" automatically.
        const user = await Users.findOneAndUpdate(
          { clerkId: id },
          {
            clerkId: id,
            email: email_addresses[0].email_address,
            image: image_url,
            role: 'MEMBER',
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Ensure user has a Favorite list
        const favExists = await Favorite.findOne({ userId: user._id });
        if (!favExists) {
          await Favorite.create({ userId: user._id });
        }

        console.log(`User created/synced: ${id}`);
        return new Response('User created', { status: 200 });
      }

      case 'user.updated': {
        const { id, email_addresses, image_url } = evt.data;

        // Update both email and image
        await Users.findOneAndUpdate(
          { clerkId: id },
          {
            email: email_addresses[0]?.email_address,
            image: image_url,
          }
        );

        console.log(`User updated: ${id}`);
        return new Response('User updated', { status: 200 });
      }

      case 'user.deleted': {
        const { id } = evt.data;

        const user = await Users.findOne({ clerkId: id });
        if (!user) {
          // Return 200 even if not found to stop Clerk from retrying
          return new Response('User not found, nothing to delete', {
            status: 200,
          });
        }

        const favorite = await Favorite.findOne({ userId: user._id });

        if (favorite) {
          await PromptFavorite.deleteMany({ favoriteId: favorite._id });
          await Favorite.deleteOne({ _id: favorite._id });
        }

        await Users.deleteOne({ _id: user._id });
        console.log(`User deleted: ${id}`);
        return new Response('User deleted', { status: 200 });
      }

      default:
        return new Response('Event type not handled', { status: 200 });
    }
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
