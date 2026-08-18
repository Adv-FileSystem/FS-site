export const SUPABASE_URL = 'https://ijnminpukerdhvtfykjc.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_tkkFS_ssEhBX7iJNyhDMQw_qmnbUtF3';

export function createClient() {
  return window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

export async function loadContent(sb, ids) {
  const { data, error } = await sb.from('page_content').select('section_id, html').in('section_id', ids);
  if (error || !data) return;
  data.forEach(row => {
    const el = document.getElementById(row.section_id);
    if (el && row.html) el.innerHTML = row.html;
  });
}

export async function saveSections(sb, ids) {
  const rows = ids.map(id => {
    const el = document.getElementById(id);
    return el ? { section_id: id, html: el.innerHTML, updated_at: new Date().toISOString() } : null;
  }).filter(Boolean);
  return sb.from('page_content').upsert(rows);
}

export async function checkLogin(sb, id, pw) {
  if (id !== 'admin') return false;
  const { data, error } = await sb.from('admin_auth').select('password').eq('id', 1).single();
  return !(error || !data || data.password !== pw);
}
