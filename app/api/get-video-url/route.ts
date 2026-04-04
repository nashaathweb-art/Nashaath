// app/api/get-video-url/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { createClient } from "@supabase/supabase-js";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const { lessonId, userId } = await req.json();

    if (!lessonId || !userId) {
      return NextResponse.json(
        { error: "Missing lessonId or userId" },
        { status: 400 },
      );
    }

    // 1. Get lesson
    const { data: lesson, error: lessonErr } = await supabase
      .from("lessons")
      .select("id, video_url, course_id")
      .eq("id", lessonId)
      .single();

    if (lessonErr || !lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // 2. Check enrollment
    const { data: enrollment, error: enrollErr } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", userId)
      .eq("course_id", lesson.course_id)
      .single();

    if (enrollErr || !enrollment) {
      return NextResponse.json(
        { error: "Not enrolled in this course" },
        { status: 403 },
      );
    }

    const url = lesson.video_url as string;

    // ── YouTube URL — return directly (already embed URL) ──────
    if (url.includes("youtube.com/embed")) {
      return NextResponse.json({ url, type: "youtube" });
    }

    // ── Cloudinary URL ─────────────────────────────────────────
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) {
      return NextResponse.json(
        { error: "Invalid video URL" },
        { status: 400 },
      );
    }

    let publicIdWithExt = url.slice(uploadIndex + "/upload/".length);
    publicIdWithExt = publicIdWithExt.replace(/^s--[^-]+--\//, "");          // remove signature
    publicIdWithExt = publicIdWithExt.replace(/^v\d+\//, "");                 // remove version
    publicIdWithExt = publicIdWithExt.replace(/^([a-z]+_[a-z0-9]+\/)+/, ""); // remove transformations
    publicIdWithExt = publicIdWithExt.split("?")[0];                          // remove query string
    const publicId  = publicIdWithExt.replace(/\.[^/.]+$/, "");               // remove extension

    console.log("✅ publicId:", publicId);

    const expiresAt = Math.floor(Date.now() / 1000) + 60 * 30; // 30 mins

    const signedUrl = cloudinary.url(publicId, {
      resource_type: "video",
      type: "upload",
      sign_url: true,
      expires_at: expiresAt,
      format: "mp4",
      secure: true,
    });

    console.log("✅ signedUrl:", signedUrl);
    return NextResponse.json({ url: signedUrl, type: "cloudinary" });

  } catch (err) {
    console.error("❌ get-video-url error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}