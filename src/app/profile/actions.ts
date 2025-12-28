"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface ProfileData {
  full_name: string | null;
  phone: string | null;
  location: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  current_title: string | null;
  years_of_experience: number | null;
  resume_url: string | null;
}

export interface ProfileResult {
  success: boolean;
  error?: string;
  data?: ProfileData;
}

/**
 * Get the current user's profile
 */
export async function getProfile(): Promise<ProfileResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: {
        full_name: data.full_name,
        phone: data.phone,
        location: data.location,
        linkedin_url: data.linkedin_url,
        portfolio_url: data.portfolio_url,
        current_title: data.current_title,
        years_of_experience: data.years_of_experience,
        resume_url: data.resume_url,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Update the current user's profile
 */
export async function updateProfile(formData: FormData): Promise<ProfileResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const profileData = {
      full_name: formData.get("full_name") as string,
      phone: formData.get("phone") as string,
      location: formData.get("location") as string,
      linkedin_url: formData.get("linkedin_url") as string,
      portfolio_url: formData.get("portfolio_url") as string,
      current_title: formData.get("current_title") as string,
      years_of_experience: formData.get("years_of_experience")
        ? parseInt(formData.get("years_of_experience") as string)
        : null,
    };

    const { error } = await supabase.from("profiles").update(profileData).eq("id", user.id);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Update resume URL in profile
 */
export async function updateResumeUrl(resumeUrl: string): Promise<ProfileResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const { error } = await supabase
      .from("profiles")
      .update({ resume_url: resumeUrl })
      .eq("id", user.id);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath("/profile");

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
