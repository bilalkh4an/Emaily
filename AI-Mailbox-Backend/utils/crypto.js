import crypto from "crypto";
import dotenv from "dotenv";


dotenv.config();
const algorithm = "aes-256-cbc";
const secretKey = crypto
  .createHash("sha256")
  .update(process.env.EMAIL_SECRET_KEY)
  .digest(); // 32 bytes key


export function encrypt(text) {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
}

export function decrypt(hash) {
  const [ivHex, encryptedText] = hash.split(":");
  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}