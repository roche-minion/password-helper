// SHA-1 hash function for breach detection
async function sha1(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  async function checkBreach(password) {
    const hash = (await sha1(password)).toUpperCase();
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const data = await response.text();
    return data.includes(suffix);
  }
  