/**
 * Encryption utilities for securely storing sensitive data
 * Uses AES-256-GCM encryption with the Web Crypto API
 */

const ALGORITHM = "AES-GCM";

/**
 * Get the encryption key from environment variable
 */
function getEncryptionKey(): string {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("ENCRYPTION_KEY environment variable is not set");
  }
  return key;
}

/**
 * Derive a crypto key from the encryption key string
 */
async function deriveKey(keyString: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(keyString);

  // Hash the key to get consistent 256-bit key
  const hashBuffer = await crypto.subtle.digest("SHA-256", keyData);

  return crypto.subtle.importKey("raw", hashBuffer, { name: ALGORITHM }, false, [
    "encrypt",
    "decrypt",
  ]);
}

/**
 * Encrypt a string value
 * Returns base64-encoded encrypted data with IV prepended
 */
export async function encrypt(plaintext: string): Promise<string> {
  try {
    const keyString = getEncryptionKey();
    const key = await deriveKey(keyString);

    // Generate random IV (Initialization Vector)
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);

    // Encrypt the data
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv,
      },
      key,
      data
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedData.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedData), iv.length);

    // Convert to base64
    return Buffer.from(combined).toString("base64");
  } catch (error) {
    throw new Error(
      `Encryption failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Decrypt an encrypted string
 * Expects base64-encoded data with IV prepended
 */
export async function decrypt(encryptedData: string): Promise<string> {
  try {
    const keyString = getEncryptionKey();
    const key = await deriveKey(keyString);

    // Decode from base64
    const combined = Buffer.from(encryptedData, "base64");

    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    // Decrypt the data
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv,
      },
      key,
      data
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    throw new Error(
      `Decryption failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
