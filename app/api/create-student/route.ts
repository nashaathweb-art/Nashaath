import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // ← match Vercel variable name
);

export async function POST(req: NextRequest) {
  try {
    const { fullName, phone, password, courseId } = await req.json();

    const fakeEmail = `${phone.trim()}@student.com`;

    // 1. Create auth user
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: fakeEmail,
        password,
        email_confirm: true,
      });

    if (authError) {
      return NextResponse.json(
        {
          error: authError.message.includes("already")
            ? "A student with this phone number already exists."
            : authError.message,
        },
        { status: 400 }
      );
    }

    const userId = authData.user.id;

    // 2. Insert profile
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({ id: userId, full_name: fullName.trim(), phone: phone.trim() });

    if (profileError) {
      return NextResponse.json(
        { error: "Failed to save student profile." },
        { status: 500 }
      );
    }

    // 3. Enroll in course
    const { error: enrollError } = await supabaseAdmin
      .from("enrollments")
      .insert({ user_id: userId, course_id: courseId });

    if (enrollError) {
      return NextResponse.json(
        { error: "Failed to enroll student." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, userId });

  } catch {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}