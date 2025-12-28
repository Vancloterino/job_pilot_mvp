import { createClient } from "@/lib/supabase/client";

export type StorageBucket = "resumes" | "cover-letters";

export interface UploadFileOptions {
  file: File;
  bucket: StorageBucket;
  userId: string;
  onProgress?: (progress: number) => void;
}

export interface UploadFileResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Upload a file to Supabase Storage
 * Files are stored in user-specific folders: {userId}/{filename}
 */
export async function uploadFile({
  file,
  bucket,
  userId,
}: UploadFileOptions): Promise<UploadFileResult> {
  try {
    const supabase = createClient();

    // Generate unique filename with timestamp
    const timestamp = new Date().getTime();
    const fileExt = file.name.split(".").pop();
    const fileName = `${timestamp}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Upload file
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return {
      success: true,
      url: publicUrl,
      path: data.path,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(
  bucket: StorageBucket,
  filePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Get download URL for a file
 */
export async function getFileUrl(
  bucket: StorageBucket,
  filePath: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabase = createClient();

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * List all files for a user in a bucket
 */
export async function listUserFiles(
  bucket: StorageBucket,
  userId: string
): Promise<{ success: boolean; files?: Array<{ name: string; path: string }>; error?: string }> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase.storage.from(bucket).list(userId, {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const files = data.map((file) => ({
      name: file.name,
      path: `${userId}/${file.name}`,
    }));

    return {
      success: true,
      files,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Download a file from Supabase Storage
 */
export async function downloadFile(
  bucket: StorageBucket,
  filePath: string
): Promise<{ success: boolean; blob?: Blob; error?: string }> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase.storage.from(bucket).download(filePath);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      blob: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Validate file before upload
 */
export function validateFile(
  file: File,
  _bucket: StorageBucket
): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File size exceeds 5MB limit",
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Only PDF and Word documents are allowed",
    };
  }

  return { valid: true };
}
