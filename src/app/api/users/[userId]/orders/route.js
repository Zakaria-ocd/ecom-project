import { NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const token =
      request.headers.get("authorization")?.split(" ")[1] || getAuthToken();

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = params.userId;

    // Get API base URL from env or use default
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    // Instead of using Prisma, fetch from the Laravel backend
    const response = await fetch(`${API_URL}/api/users/${userId}/orders`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to fetch orders" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
