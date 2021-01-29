module.exports = function translateTimestamp(timestamp) {
  const day = new Date(timestamp).getUTCDate()
  const month = new Date(timestamp).getUTCMonth() + 1
  const year = new Date(timestamp).getUTCFullYear()
  
  let h = new Date(timestamp).getHours()
  let m = new Date(timestamp).getMinutes()

  h = (h<10) ? '0' + h : h;
  m = (m<10) ? '0' + m : m;

  return `${day}/${month}/${year} ${h}:${m}`
}