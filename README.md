# Petra homepage

`(주)페트라`의 공개 홈페이지 전용 저장소다. 웹사이트 코드와 공개가 승인된 콘텐츠만 관리한다.

## 저장소 경계

- 회사 내부 문서와 원본은 별도의 비공개 저장소에서 관리한다.
- 이 저장소는 비공개 저장소의 파일을 빌드·실행 시 직접 참조하지 않는다.
- 고객별 거래정보, 손익·재고, 내부 목표·전략, 내부 구매·승인 원문, 등록 식별번호와 자격증명은 이 저장소에 넣지 않는다.
- 내부 자료에서 공개 가능한 정보를 옮길 때는 `content/facts-to-confirm.md`를 먼저 확인한다.

## 로컬 개발

Node.js 22.12.0 이상이 필요하다. 저장소 루트에서 다음 명령을 실행한다.

```bash
npm install
npm run dev
```

`npm run dev`가 출력하는 로컬 주소에서 홈페이지를 확인한다. 변경 후 검증 명령은 다음과 같다.

```bash
npm test
npm run check
npm run build
```

`npm test`는 실제 정적 페이지를 빌드해 공개 콘텐츠와 탐색·접근성 계약을 검사한다. `npm run check`는 Astro와 TypeScript 진단을 실행하며, `npm run build`는 `dist/`에 정적 사이트를 생성한다. 생성 결과는 커밋하지 않는다.

## 공개 콘텐츠

[`src/data/site.ts`](src/data/site.ts)가 홈페이지의 승인된 공개 문구와 회사 정보의 소스다. 회사 사실과 서비스 설명은 이 파일에서 관리하고, 아래 문서는 공개 콘텐츠의 배경 자료로 참고한다.

- [`content/company-profile.md`](content/company-profile.md): 공개 회사 소개 초안
- [`content/services.md`](content/services.md): 서비스 설명 초안
- [`content/messaging.md`](content/messaging.md): 홈페이지 메시지 후보
- [`content/facts-to-confirm.md`](content/facts-to-confirm.md): 게시 전 확인 목록

홈페이지는 Astro로 구현한 단일 정적 페이지이며, 대표 공개 주소는
[`https://petra.parts`](https://petra.parts)다. `www.petra.parts`는 같은 GitHub Pages 사이트를
가리키며 대표 주소로 리디렉션한다. Pull request에서는 설치·정적 검사·테스트·빌드만 수행하고,
검증을 통과한 `main` 커밋만 GitHub Pages에 자동 배포한다.

## 사용자 지정 도메인

GitHub Pages의 Custom domain은 `petra.parts`로 설정한다. DNS 제공자에는 다음 웹 연결 레코드만
두며, 값은 2026-09-09 GitHub Pages 공식 안내를 기준으로 한다.

| 호스트 | 유형 | 값 |
| --- | --- | --- |
| `@` | `A` | `185.199.108.153` |
| `@` | `A` | `185.199.109.153` |
| `@` | `A` | `185.199.110.153` |
| `@` | `A` | `185.199.111.153` |
| `@` | `AAAA` | `2606:50c0:8000::153` |
| `@` | `AAAA` | `2606:50c0:8001::153` |
| `@` | `AAAA` | `2606:50c0:8002::153` |
| `@` | `AAAA` | `2606:50c0:8003::153` |
| `www` | `CNAME` | `esroboblock.github.io` |

기존 MX/TXT/SPF/DKIM 등 메일 관련 레코드는 웹 연결과 별개이며 변경하지 않는다. DNS를 다시
변경할 때는 먼저 전체 레코드를 별도로 백업하고, GitHub의 최신 공식 안내와 저장소 Pages 설정을
재확인한다. 웹 연결을 되돌릴 때도 백업본과 대조해 위 웹 레코드 및 Pages Custom domain만
제거하거나 이전 값으로 복구하며 메일 레코드는 건드리지 않는다. Actions 방식 배포에서는
저장소의 `CNAME` 파일을 사용하지 않는다.
