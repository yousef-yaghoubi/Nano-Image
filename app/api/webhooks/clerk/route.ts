import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Important: Configure route to accept raw body
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // Get the headers
    const headerPayload = headers();
    const svix_id = (await headerPayload).get('svix-id');
    const svix_timestamp = (await headerPayload).get('svix-timestamp');
    const svix_signature = (await headerPayload).get('svix-signature');

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error('Missing svix headers');
      return new Response('Error occurred -- no svix headers', {
        status: 400,
      });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your webhook secret
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('Missing CLERK_WEBHOOK_SECRET');
      return new Response('Server configuration error', {
        status: 500,
      });
    }

    const wh = new Webhook(webhookSecret);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return new Response('Error occurred', {
        status: 400,
      });
    }

    // Handle the webhook
    const eventType = evt.type;

    if (eventType === 'user.created') {
      const { id, email_addresses, image_url } = evt.data;
      // Check if email exists
      if (!email_addresses || email_addresses.length === 0) {
        return new Response('No email found', { status: 400 });
      }

      try {
        // Create user with default role MEMBER
        const user = await prisma.users.create({
          data: {
            clerkId: id,
            email: email_addresses[0].email_address,
            image: image_url,
            role: 'MEMBER', // Default role
          },
        });

        // Optionally create a Favorite record for the user
        await prisma.favorite.create({
          data: {
            userId: user.id,
          },
        });

        console.log('User created in database:', id);
        return new Response('User created successfully', { status: 200 });
      } catch (error) {
        console.error('Error creating user:', error);
        return new Response('Error creating user', { status: 500 });
      }
    }

    if (eventType === 'user.updated') {
      const { id, email_addresses } = evt.data;

      if (!email_addresses || email_addresses.length === 0) {
        return new Response('No email found', { status: 400 });
      }

      try {
        await prisma.users.update({
          where: { clerkId: id },
          data: {
            email: email_addresses[0].email_address,
          },
        });

        console.log('User updated in database:', id);
        return new Response('User updated successfully', { status: 200 });
      } catch (error) {
        console.error('Error updating user:', error);
        return new Response('Error updating user', { status: 500 });
      }
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data;

      try {
        // Find the user first to get their ID
        const user = await prisma.users.findUnique({
          where: { clerkId: id },
          include: { favorite: true },
        });

        if (!user) {
          return new Response('User not found', { status: 404 });
        }

        // Delete related Favorite and PromptFavorites (cascade)
        if (user.favorite) {
          // Delete all PromptFavorites first
          await prisma.promptFavorite.deleteMany({
            where: { favoriteId: user.favorite.id },
          });

          // Delete the Favorite
          await prisma.favorite.delete({
            where: { id: user.favorite.id },
          });
        }

        // Delete the user
        await prisma.users.delete({
          where: { clerkId: id },
        });

        console.log('User deleted from database:', id);
        return new Response('User deleted successfully', { status: 200 });
      } catch (error) {
        console.error('Error deleting user:', error);
        return new Response('Error deleting user', { status: 500 });
      }
    }

    return new Response('Webhook processed successfully', { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err });
  }
}
