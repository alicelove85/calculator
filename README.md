# 화장품 박스·수율 계산기

정적 HTML/CSS/JS — **GitHub Pages**에 올리면 브라우저 주소로 접속할 수 있습니다.

## 배포 방법

1. [GitHub](https://github.com)에서 **새 저장소**를 만듭니다 (예: `calculator`).
2. 이 폴더에서 아래를 실행합니다 (한 번만).

```bash
cd calculator
git init
git add .
git commit -m "Initial: calculator for GitHub Pages"
git branch -M main
git remote add origin https://github.com/본인아이디/calculator.git
git push -u origin main
```

3. GitHub 저장소 → **Settings** → **Pages** → **Build and deployment** → **Source**를 **GitHub Actions**로 선택합니다.
4. `main`에 푸시할 때마다 워크플로가 사이트를 배포합니다.
5. 몇 분 뒤 **Settings → Pages**에 표시되는 주소로 접속합니다.

   - 예: `https://본인아이디.github.io/calculator/`

## 휴대폰 홈 화면에 추가

- **Android (Chrome)**: 메뉴(⋮) → **홈 화면에 추가** 또는 주소창 설치 배너.
- **iPhone (Safari)**: 공유(□↑) → **홈 화면에 추가**.
- **HTTPS**로 열린 사이트(GitHub Pages 등)에서 동작합니다. 아이콘은 `site.webmanifest`·PNG·`apple-touch-icon`으로 연결돼 있습니다.
- 아이콘 PNG를 다시 만들 때: `python3 build-icons.py`

## 한 페이지에서 쓰기

- **박스·수율**과 **역산**은 모두 `index.html` 안에서 위쪽 탭으로 전환합니다.
- 주소 예: `…/index.html#reverse` 로 역산 화면만 바로 열 수 있습니다.
- 예전 주소 `reverse.html`은 자동으로 `index.html#reverse`로 넘깁니다.

## 로컬에서 보기

```bash
python3 -m http.server 8765
```

브라우저에서 `http://127.0.0.1:8765/index.html` 을 엽니다.
