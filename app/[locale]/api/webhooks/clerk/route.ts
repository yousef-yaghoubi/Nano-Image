import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Favorite, PromptFavorite, Users } from '@/models';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    await dbConnect(); // ⬅️ اتصال به MongoDB

    // ----------------------- HEADERS -----------------------
    const headerPayload = headers();
    const svix_id = (await headerPayload).get('svix-id');
    const svix_timestamp = (await headerPayload).get('svix-timestamp');
    const svix_signature = (await headerPayload).get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response('Missing svix headers', { status: 400 });
    }

    // ----------------------- VERIFY -----------------------
    const payload = await req.json();
    const body = JSON.stringify(payload);

    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) return new Response('Missing CLERK_WEBHOOK_SECRET', { status: 500 });

    const wh = new Webhook(webhookSecret);

    let evt: WebhookEvent;
    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return new Response('Error verifying webhook', { status: 400 });
    }

    const eventType = evt.type;

    // ---------------------- USER.CREATED ----------------------
    if (eventType === 'user.created') {
      const { id, email_addresses, image_url } = evt.data;

      if (!email_addresses?.length) return new Response('No email found', { status: 400 });

      try {
        const user = await Users.create({
          clerkId: id,
          email: email_addresses[0].email_address,
          image: image_url,
          role: 'MEMBER',
        });

        await Favorite.create({ userId: user._id });

        console.log('User created in database:', id);
        return new Response('User created successfully', { status: 200 });
      } catch (error) {
        console.error('Error creating user:', error);
        return new Response('Error creating user', { status: 500 });
      }
    }

    // ---------------------- USER.UPDATED ----------------------
    if (eventType === 'user.updated') {
      const { id, email_addresses } = evt.data;
      if (!email_addresses?.length) return new Response('No email found', { status: 400 });

      try {
        await Users.findOneAndUpdate(
          { clerkId: id },
          { email: email_addresses[0].email_address }
        );

        console.log('User updated in database:', id);
        return new Response('User updated successfully', { status: 200 });
      } catch (error) {
        console.error('Error updating user:', error);
        return new Response('Error updating user', { status: 500 });
      }
    }

    // ---------------------- USER.DELETED ----------------------
    if (eventType === 'user.deleted') {
      const { id } = evt.data;

      try {
        const user = await Users.findOne({ clerkId: id });
        if (!user) return new Response('User not found', { status: 404 });

        const favorite = await Favorite.findOne({ userId: user._id });

        if (favorite) {
          await PromptFavorite.deleteMany({ favoriteId: favorite._id });
          await Favorite.deleteOne({ _id: favorite._id });
        }

        await Users.deleteOne({ _id: user._id });

        console.log('User deleted from database:', id);
        return new Response('User deleted successfully', { status: 200 });
      } catch (error) {
        console.error('Error deleting user:', error);
        return new Response('Error deleting user', { status: 500 });
      }
    }

    return new Response('Webhook processed successfully', { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err });
  }
}
