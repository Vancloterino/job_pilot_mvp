"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface JobPreferencesData {
  desired_titles: string[];
  desired_locations: string[];
  remote_only: boolean;
  hybrid_ok: boolean;
  min_salary: number | null;
  max_salary: number | null;
  employment_types: string[];
  experience_levels: string[];
  industries: string[];
  company_sizes: string[];
  keywords: string[];
  excluded_keywords: string[];
  excluded_companies: string[];
}

export interface PreferencesResult {
  success: boolean;
  error?: string;
  data?: JobPreferencesData;
}

/**
 * Get the current user's job preferences
 */
export async function getJobPreferences(): Promise<PreferencesResult> {
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

    const { data, error } = await supabase
      .from("job_preferences")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      // If no preferences exist, return default values
      if (error.code === "PGRST116") {
        return {
          success: true,
          data: {
            desired_titles: [],
            desired_locations: [],
            remote_only: false,
            hybrid_ok: true,
            min_salary: null,
            max_salary: null,
            employment_types: ["full-time"],
            experience_levels: [],
            industries: [],
            company_sizes: [],
            keywords: [],
            excluded_keywords: [],
            excluded_companies: [],
          },
        };
      }

      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: {
        desired_titles: data.desired_titles || [],
        desired_locations: data.desired_locations || [],
        remote_only: data.remote_only || false,
        hybrid_ok: data.hybrid_ok || true,
        min_salary: data.min_salary,
        max_salary: data.max_salary,
        employment_types: data.employment_types || ["full-time"],
        experience_levels: data.experience_levels || [],
        industries: data.industries || [],
        company_sizes: data.company_sizes || [],
        keywords: data.keywords || [],
        excluded_keywords: data.excluded_keywords || [],
        excluded_companies: data.excluded_companies || [],
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
 * Save or update the current user's job preferences
 */
export async function saveJobPreferences(formData: FormData): Promise<PreferencesResult> {
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

    // Parse array fields from form data
    const parseArray = (fieldName: string): string[] => {
      const value = formData.get(fieldName) as string;
      return value
        ? value
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean)
        : [];
    };

    const preferencesData = {
      user_id: user.id,
      desired_titles: parseArray("desired_titles"),
      desired_locations: parseArray("desired_locations"),
      remote_only: formData.get("remote_only") === "true",
      hybrid_ok: formData.get("hybrid_ok") === "true",
      min_salary: formData.get("min_salary")
        ? parseInt(formData.get("min_salary") as string)
        : null,
      max_salary: formData.get("max_salary")
        ? parseInt(formData.get("max_salary") as string)
        : null,
      employment_types: parseArray("employment_types"),
      experience_levels: parseArray("experience_levels"),
      industries: parseArray("industries"),
      company_sizes: parseArray("company_sizes"),
      keywords: parseArray("keywords"),
      excluded_keywords: parseArray("excluded_keywords"),
      excluded_companies: parseArray("excluded_companies"),
    };

    // Try to update first, if not exists then insert
    const { error: updateError } = await supabase
      .from("job_preferences")
      .update(preferencesData)
      .eq("user_id", user.id);

    if (updateError) {
      // If update fails because row doesn't exist, insert
      if (updateError.code === "PGRST116") {
        const { error: insertError } = await supabase
          .from("job_preferences")
          .insert(preferencesData);

        if (insertError) {
          return {
            success: false,
            error: insertError.message,
          };
        }
      } else {
        return {
          success: false,
          error: updateError.message,
        };
      }
    }

    revalidatePath("/preferences");
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
