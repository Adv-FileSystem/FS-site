// Supabase Edge Function: dynamic-endpoint
// GitHub API 프록시. 대시보드 > Edge Functions > dynamic-endpoint > Code 에 이 내용을 붙여넣고 Deploy.
//
// Secrets 에 GITHUB_TOKEN 등록 (시간당 5,000회 한도 적용용).
// Verify JWT 는 켜둔 채로 둬도 됩니다 — 사이트가 publishable key 를 함께 보냅니다.

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Expose-Headers": "X-GitHub-Link",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const { endpoint } = await req.json();
    if (typeof endpoint !== "string" || !endpoint.startsWith("/")) {
      return new Response(JSON.stringify({ error: "invalid endpoint" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }
    const token = Deno.env.get("GITHUB_TOKEN") ?? "";
    const res = await fetch("https://api.github.com" + endpoint, {
      headers: {
        "Accept": "application/vnd.github+json",
        "User-Agent": "adv-filesystem-site",
        ...(token ? { "Authorization": "Bearer " + token } : {}),
      },
    });
    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: {
        ...cors,
        "Content-Type": "application/json",
        // 총 커밋 수를 계산하려면 클라이언트가 GitHub 의 Link 헤더를 봐야 합니다.
        "X-GitHub-Link": res.headers.get("link") ?? "",
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
