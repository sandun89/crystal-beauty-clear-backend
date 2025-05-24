export function generateId(prefix=""){
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  const year = pad(now.getFullYear() % 100);  // YY
  const month = pad(now.getMonth() + 1);      // MM (0-indexed)
  const day = pad(now.getDate());             // DD
  const hour = pad(now.getHours());           // HH
  const minute = pad(now.getMinutes());       // MM
  const second = pad(now.getSeconds());       // SS
  const millis = pad(now.getMilliseconds(), 3); // mmm

  return `${prefix}${year}${month}${day}${hour}${minute}${second}${millis}`;
}

