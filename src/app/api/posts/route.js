import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Post from "@/models/Post";
import mongoose from "mongoose";

export const GET = async (request) => {
	const url = new URL(request.url);

	const username = url.searchParams.get("username");

	try {
		await connect();
		const posts = await Post.find(username && { username });
		return new NextResponse(
			JSON.stringify({
				success: true,
				data: posts,
				message: "Posts fetched successfully",
			}),
			{ status: 200 }
		);
	} catch (err) {
		return new NextResponse("Database Error", { status: 500 });
	} finally {
		await mongoose.connection.close();
	}
};

export const POST = async (request) => {
	const body = await request.json();

	const newPost = new Post(body);

	try {
		await connect();
		await newPost.save();

		return new NextResponse(
			JSON.stringify({
				success: true,
				data: newPost,
				message: "Post created successfully",
			}),
			{ status: 201 }
		);
	} catch (err) {
		return new NextResponse("Database Error", { status: 500 });
	} finally {
		await mongoose.connection.close();
	}
};
