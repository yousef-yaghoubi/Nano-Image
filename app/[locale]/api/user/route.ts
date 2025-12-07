import dbConnect from "@/lib/db";
import {Users} from "@/models/index";

export async function GET() {
    await dbConnect()

    const users = await Users.find().lean()

    console.log(users)
}