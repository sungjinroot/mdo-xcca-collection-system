function parseRoomId(v) {
  if (v == null || v === '') return null;
  const n = typeof v === 'number' ? v : parseInt(String(v).trim(), 10);
  return Number.isFinite(n) && n >= 1 ? n : null;
}

async function roomExists(pool, roomID) {
  const r = await pool.query('SELECT 1 FROM Rooms WHERE roomID = $1', [roomID]);
  return r.rowCount > 0;
}

module.exports = { parseRoomId, roomExists };
