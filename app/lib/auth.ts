// OPERASIONAL: Modul keamanan enkripsi untuk menandatangani (sign) dan memverifikasi token JWT secara dinamis. Mendukung Web Crypto API agar kompatibel dengan lingkungan Edge Runtime Next.js.

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_fallback_terbanginaja_2026_key_987654321';

export async function signToken(payload: any): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(JWT_SECRET);
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const data = btoa(JSON.stringify(payload));
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(`${header}.${data}`)
  );
  
  const signature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
    
  return `${header}.${data}.${signature}`;
}

export async function verifyToken(token: string): Promise<any | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, data, signature] = parts;
    
    const encoder = new TextEncoder();
    const keyData = encoder.encode(JWT_SECRET);
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    // OPERASIONAL: Mengubah kembali string tanda tangan digital base64 menjadi bentuk biner (Uint8Array) untuk diproses oleh Web Crypto API.
    const signatureBuffer = Uint8Array.from(
      atob(signature.replace(/-/g, '+').replace(/_/g, '/')),
      (c) => c.charCodeAt(0)
    );
    
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBuffer,
      encoder.encode(`${header}.${data}`)
    );
    
    if (!isValid) return null;
    
    // OPERASIONAL: Membaca dan mendekode payload data JSON milik user dari format base64 setelah token terverifikasi valid.
    const decodedData = JSON.parse(atob(data));
    return decodedData;
  } catch (err) {
    return null;
  }
}

