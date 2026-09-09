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

홈페이지는 Astro로 구현한 단일 정적 페이지다. GitHub Pages 배포와 사용자 지정 도메인 연결은 Issue #2의 범위에 포함하지 않으며 후속 작업으로 진행한다.
