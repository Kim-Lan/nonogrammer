// Source - https://stackoverflow.com/a/67600346
// Posted by mikemaccana, modified by community. See post 'Timeline' for change history
// Retrieved 2026-11-20, License - CC BY-SA 4.0
//
// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest'

export async function getSHA256Hash(input: string): Promise<string> {
  const inputUint8 = new TextEncoder().encode(input);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', inputUint8);
  const hashHex = new Uint8Array(hashBuffer).toHex();
  return hashHex;
};
