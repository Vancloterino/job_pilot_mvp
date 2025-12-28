"use server";

import { createClient } from "@/lib/supabase/server";
import { encrypt, decrypt } from "@/lib/encryption";
import { revalidatePath } from "next/cache";

export type Platform = "indeed" | "linkedin" | "glassdoor" | "ziprecruiter" | "monster" | "dice";

export interface CredentialData {
  id: string;
  platform: Platform;
  username: string;
  is_verified: boolean;
  last_verified_at: string | null;
  created_at: string;
}

export interface CredentialsResult {
  success: boolean;
  error?: string;
  data?: CredentialData[];
}

export interface SaveCredentialResult {
  success: boolean;
  error?: string;
}

/**
 * Get all credentials for the current user (decrypted usernames only, no passwords)
 */
export async function getCredentials(): Promise<CredentialsResult> {
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
      .from("job_board_credentials")
      .select("id, platform, encrypted_username, is_verified, last_verified_at, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Decrypt usernames
    const decryptedData: CredentialData[] = await Promise.all(
      (data || []).map(async (cred) => ({
        id: cred.id,
        platform: cred.platform as Platform,
        username: await decrypt(cred.encrypted_username),
        is_verified: cred.is_verified,
        last_verified_at: cred.last_verified_at,
        created_at: cred.created_at,
      }))
    );

    return {
      success: true,
      data: decryptedData,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Save or update credentials for a platform
 */
export async function saveCredentials(formData: FormData): Promise<SaveCredentialResult> {
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

    const platform = formData.get("platform") as Platform;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!platform || !username || !password) {
      return {
        success: false,
        error: "Platform, username, and password are required",
      };
    }

    // Encrypt credentials
    const encryptedUsername = await encrypt(username);
    const encryptedPassword = await encrypt(password);

    // Check if credentials already exist for this platform
    const { data: existing } = await supabase
      .from("job_board_credentials")
      .select("id")
      .eq("user_id", user.id)
      .eq("platform", platform)
      .single();

    if (existing) {
      // Update existing credentials
      const { error } = await supabase
        .from("job_board_credentials")
        .update({
          encrypted_username: encryptedUsername,
          encrypted_password: encryptedPassword,
          is_verified: false,
          last_verified_at: null,
        })
        .eq("id", existing.id);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }
    } else {
      // Insert new credentials
      const { error } = await supabase.from("job_board_credentials").insert({
        user_id: user.id,
        platform,
        encrypted_username: encryptedUsername,
        encrypted_password: encryptedPassword,
        is_verified: false,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }
    }

    revalidatePath("/credentials");

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
 * Delete credentials for a platform
 */
export async function deleteCredentials(credentialId: string): Promise<SaveCredentialResult> {
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
      .from("job_board_credentials")
      .delete()
      .eq("id", credentialId)
      .eq("user_id", user.id);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath("/credentials");

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
