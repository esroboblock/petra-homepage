export const company = {
  legalName: '(주)페트라',
  englishName: 'PETRA',
  founded: '2026년 5월',
  representative: '정동익',
  location: '서울특별시 구로구',
  domain: 'petra.parts',
  email: 'petra@petra.parts',
} as const;

export const navigation = [
  { label: '홈', href: '#hero' },
  { label: '회사 소개', href: '#about' },
  { label: '서비스', href: '#services' },
  { label: '문의', href: '#contact' },
] as const;

export const primaryService = {
  name: '전자부품 수급·유통',
  description:
    '제품 개발과 생산에 필요한 전기·전자부품의 수급 가능성을 검토하고 유통·무역 방식의 공급을 협의한다.',
} as const;

export const businessAreas = [
  '소프트웨어 개발',
  '로봇·드론 기술개발 및 컨설팅',
] as const;
