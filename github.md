repo: Adv-FileSystem/DAOS-core, Adv-FileSystem/spdk, Adv-FileSystem/Aurora_Dataloader, Adv-FileSystem/nbdkit-plugin, Adv-FileSystem/Aurora_AD, Adv-FileSystem/Aurora_DA, Adv-FileSystem/io-bench
branch: main/master (per repo default)

## Last sync
date: 2026-08-19T04:55:00Z

### Updated in this project
- devcontent.dc.html: expanded nbdkit-plugin and io-bench 핵심 내용 to cover full README detail (nbdkit TODO list; io-bench drop_caches/perf/FlameGraph workflow and result-interpretation criteria) — confirmed io-bench's README-mentioned scripts/ folder doesn't actually exist in the repo, so only the two present .py files are covered
- devcontent.dc.html: filled in each dev-content detail panel (핵심 내용 bullets, tech stack tags) using each repo's README
- devcontent.dc.html: re-checked repo trees, not just READMEs — nbdkit-plugin and io-bench have real code, enriched their 핵심 내용 with specifics from the actual scripts (pwrite/pread chunk logic, pytorch_bench.py/tf_bench.py measurement approach); Aurora_Dataloader, Aurora_AD, Aurora_DA are stub repos (README only, no code); DAOS-core and spdk are full upstream mirrors, not custom code
- devcontent.dc.html: added real code snippets (from the actual repo source) under 핵심 내용 for the two items with genuine custom code — nbdkit-isc-rw.py's pwrite() and pytorch_bench.py's UCF101.__getitem__()

## Sync history
- 2026-08-18T08:28:28Z
- 2026-08-19T04:45:20Z
- 2026-08-19T04:50:20Z

## Screen map
| Screen | Source repos |
| --- | --- |
| devcontent.dc.html — 코어 개발 | Adv-FileSystem/DAOS-core |
| devcontent.dc.html — 고속 I/O 스택 | Adv-FileSystem/spdk |
| devcontent.dc.html — 데이터로더 개발 | Adv-FileSystem/Aurora_Dataloader |
| devcontent.dc.html — ISC 프로토타입 | Adv-FileSystem/nbdkit-plugin |
| devcontent.dc.html — 이상탐지 · 데이터 증강 | Adv-FileSystem/Aurora_AD, Adv-FileSystem/Aurora_DA |
| devcontent.dc.html — 벤치마크 및 검증 | Adv-FileSystem/io-bench |
