export const SUPABASE_URL = 'https://ijnminpukerdhvtfykjc.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_tkkFS_ssEhBX7iJNyhDMQw_qmnbUtF3';

export function createClient() {
  return window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

// 관리자 전용 컨트롤은 저장 스냅샷에 들어가면 안 된다.
// 스냅샷은 로그인 여부와 무관하게 innerHTML로 덮어써지므로, 저장할 때와 불러올 때 모두 걷어낸다.
const ADMIN_ONLY_LABELS = ['레포지토리 추가', '승인 전으로 되돌리기'];

function stripAdminOnly(root) {
  root.querySelectorAll('[data-admin-only]').forEach(el => el.remove());
  root.querySelectorAll('button').forEach(btn => {
    const text = (btn.textContent || '').trim();
    if (!ADMIN_ONLY_LABELS.some(label => text.includes(label))) return;
    // 예전에 저장된 스냅샷에는 data-admin-only 표시가 없으므로 문구로 찾는다.
    // 감싼 요소는 관리자 전용임이 확실할 때만 지우고, 그 밖에는 버튼만 지운다.
    const wrap = btn.parentElement;
    const wrapIsAdminRow = wrap && wrap !== root
      && !wrap.querySelector('a')
      && !wrap.hasAttribute('id')
      && Array.from(wrap.children).every(child => child === btn || child.tagName === 'SPAN');
    if (wrapIsAdminRow) wrap.remove();
    else btn.remove();
  });
  return root;
}

function sanitizeHtml(html, sectionId) {
  const holder = document.createElement('div');
  holder.innerHTML = html;
  // 목록에서 뺀 저장소 카드가 예전 스냅샷에 남아 있으면 함께 걷어낸다.
  holder.querySelectorAll('a[href$="/Adv-FileSystem/.github"]').forEach(a => {
    const card = a.parentElement && a.parentElement.parentElement;
    if (card && card !== holder) card.remove();
  });
  // github 저장본은 예전에 저장소 목록·통계까지 통째로 담고 있었다.
  // 그대로 덮으면 이후 승인된 저장소가 화면에 나타나지 않으므로 소개 문구(앞 4개 블록)만 쓴다.
  if (sectionId === 'github') {
    const wrap = holder.children.length === 1 ? holder.firstElementChild : null;
    if (wrap && wrap.children.length > 4) {
      holder.innerHTML = '';
      Array.from(wrap.children).slice(0, 4).forEach(c => holder.appendChild(c));
    }
  }
  return stripAdminOnly(holder).innerHTML;
}

export async function loadContent(sb, ids) {
  const { data, error } = await sb.from('page_content').select('section_id, html').in('section_id', ids);
  if (error || !data) return;
  data.forEach(row => {
    const el = document.getElementById(row.section_id);
    if (el && row.html) el.innerHTML = sanitizeHtml(row.html, row.section_id);
  });
}

export async function saveSections(sb, ids) {
  const rows = ids.map(id => {
    const el = document.getElementById(id);
    if (!el) return null;
    const clone = el.cloneNode(true);
    return { section_id: id, html: stripAdminOnly(clone).innerHTML, updated_at: new Date().toISOString() };
  }).filter(Boolean);
  return sb.from('page_content').upsert(rows);
}

export async function checkLogin(sb, id, pw) {
  if (id !== 'admin') return false;
  const { data, error } = await sb.from('admin_auth').select('password').eq('id', 1).single();
  return !(error || !data || data.password !== pw);
}
