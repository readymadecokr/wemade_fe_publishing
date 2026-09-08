# Fixed Header Snap Offset Verification

- 측정 화면에서 실제 고정 헤더 높이는 `138px`였다.
- 보정 전에는 루트 `scroll-padding-top: 138px`와 Media 패널 `scroll-margin-top: 112px`가 함께 적용되어 Media의 실제 시작 위치가 `250px` 아래로 밀렸다.
- 보정 후 Media 패널의 `scroll-margin-top`은 `0px`이며, `scrollIntoView({ block: "start" })` 이후 Media 패널 상단은 정확히 `138px`로 측정되었다.

다만 브라우저의 CSS 스냅이 완료된 뒤에는 Media 상단이 `383px`로 다시 이동하는 현상을 확인했다. 이는 JavaScript의 패널 이동 오프셋이 아니라 브라우저 스냅 대상의 기준이 여전히 고정 헤더와 일치하지 않는 문제이므로, 다음 보정에서는 데스크톱 패널을 문서 스냅 대상이 아닌 실제 헤더 보정 좌표로 직접 이동시키고 CSS 스냅의 재정렬을 제거한다.

추가 확인에서 `.react-home`에 남아 있던 지역 변수 `--react-home-header-height: 112px`가 문서 루트의 실제 값 `138px`을 덮어쓰고 있음을 확인했다. 이 지역 변수를 제거하고 `:root`만 기본값을 가지도록 변경해, 패널 시작점·높이·문서 스냅 여백이 같은 실제 헤더 높이를 상속하도록 보정했다.

최종 측정에서 고정 헤더는 `138px`, 루트 스크롤 여백은 `138px`, React Home 상단 여백은 `138px`, Media의 스크롤 여백은 `0px`이었다. Media를 시작점으로 정렬한 뒤 실제 Media 상단도 `138px`로 측정됐으며, 화면에서도 이전 Game Info의 빈 영역 없이 Media가 고정 헤더 바로 아래에서 시작하는 것을 확인했다.
