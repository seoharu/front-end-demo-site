# [WSD-02]-vue: Front-End Demo Site 개발
## # 🎬 Movie Streaming Platform
Netflix 스타일의 영화 스트리밍 플랫폼의 프론트엔드 데모 사이트입니다. TMDB API를 활용하여 영화 정보를 제공하고, 사용자 맞춤형 위시리스트 기능을 제공합니다.

## 🚀 주요 기능
- 🎯 실시간 영화 검색 및 필터링
- 💫 반응형 디자인 (모바일/태블릿/데스크톱)
- 🎨 애니메이션 효과가 적용된 UI/UX
- 📱 모바일 최적화
- 🔒 사용자 인증 (로그인/회원가입)
- 💝 위시리스트 기능

## 🛠 기술 스택
- ![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=flat-square&logo=vue.js&logoColor=white) Vue 3

## Project setup
## 📦 설치 및 실행

### 요구사항
- Node.js 16.0.0 이상
- npm 7.0.0 이상

### 설치
```bash

# 환경 변수 설정
cp .env.example .env
# TMDB API 키를 .env 파일에 설정
```

```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## 📂 프로젝트 구조
```
src/
├── components/      # 재사용 가능한 컴포넌트
├── views/          # 페이지 컴포넌트
├── composables/    # 컴포지션 함수
├── services/       # API 서비스
├── store/          # Pinia 스토어
└── router/         # 라우터 설정
```

## 🤝 Contributing

### Git 브랜치 전략
- `main`: 프로덕션 배포용
- `develop`: 개발 통합
- `feature/*`: 기능 개발
- `release/*`: 배포 준비
- `bugfix/*`: 긴급 수정

### 커밋 메시지 컨벤션
```
feat: 새로운 기능 추가
bugfix: 버그 수정
docs: 문서 수정
design: 디자인 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드 업무 수정
```

### PR 가이드라인
1. 기능 브랜치에서 작업 (`feature/기능명`)
2. PR 템플릿 작성
3. 승인 후 머지

## 📚 API 문서

TMDB API를 사용합니다. 자세한 내용은 [TMDB API 문서](https://developers.themoviedb.org/3)를 참조하세요.

### 주요 API 엔드포인트
- `/popular`: 홈
- `/popular`: 인기 영화 목록
- `/search`: 영화 필터링
- `/wishlist`: 내가 찜한 콘텐츠