import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96-bit IV as per PRD [cite: 64]
const AUTH_TAG_LENGTH = 16; // 128-bit auth tag [cite: 64]

/**
 * ডাটা এনক্রিপ্ট করার ফাংশন
 * @param text প্লেইন টেক্সট
 * @param key ২৮-বিটের সিক্রেট কি (DEK) [cite: 61]
 */
export function encrypt(text: string, key: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key, "hex"), iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  return {
    encryptedValue: encrypted,
    iv: iv.toString("hex"),
    authTag: authTag,
  };
}

/**
 * ডাটা ডিক্রিপ্ট করার ফাংশন
 */
export function decrypt(encryptedValue: string, key: string, iv: string, authTag: string) {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(key, "hex"),
    Buffer.from(iv, "hex")
  );

  decipher.setAuthTag(Buffer.from(authTag, "hex"));

  let decrypted = decipher.update(encryptedValue, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}