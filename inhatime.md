#인하대 시간표(inhatime.com)

##1. 개요

크리스마스 연휴를 앞두고 집에서 잉여롭게 시간을 보내던중 문득 언제나 불만이었던 학사 홈페이지에
수강신청을 좀 더 쉽게 해보고 심심하고(?) 뭔가 저만의 서비스를 만들고 싶어서 진행하게 되었습니다.
정말 충동적으로 재미있는거 해보고 혼자(?) 해보고 싶어서 진행한 프로젝트입니다.

학교 홈페이지 얼마나 별로냐면...

![학사 홈페이지](http://i.imgur.com/FSv6Qy6.png)
![학사 홈페이지](http://i.imgur.com/fca627W.png)

이런 수준입니다. 모바일용 페이지는 따로 있지만 그건 더 불편해서 언급할 가치를 못느끼겠고..
소스까서 주석읽어보니까 익스 7..8 시절에 만든거 같더라구요..ㅠ_ㅠ 뭐 목마른 사람이 우물판다고
제가 만들어야죠..암.

개발을 할려고 마음먹으니 생각보다 문제되는게 많았습니다. 생각나는대로 나열해보면

1. 데이터는 어떻게 가져오지?
2. 디자이너도 없는데 레이아웃은? 색은???
3. 자바스크립트는 포문밖에 못쓰고 이벤트만 걸줄 아는데..?

1번은 어찌어찌 크롤링으로 해결했습니다. 완전 처음에는 ajax이벤트로 처리되는 학사 홈페이지의 시간표를
어떻게 제어해야할지 감도 안잡히더라구요. 그래서 처음에는 ruby에 있는 nokogiri라는 젬을 사용해서
처리하려고 했지만 자동으로 시간표를 제어하는 방법을 몰라서 실패. 결국 phantomjs와 casperjs를
이용해서 크롤링 했는데 이건 너무 다루기가 까다로워서(함수형 논블러킹 아직도 몰라요..)
결국 아는 분께 SOS를 쳐서 requests와 BeautifulSoup4를 조합해서 크롤링하는데 성공합니다.
일주일만에 프로젝트를 진행하려 했는데..여기만 3~4일 넘게 걸림

2번은 생각보다 간단했습니다. 공대생인 내가 고민해봤자 좋은 레이아웃이 안나올테니 가지고 다른 사이트
레이아웃을 여러군데 참고하다가 할만한 꽃히는데를 참고하자는 생각이었죠.

![snutt.kr](http://i.imgur.com/b0paOtf.png)

그리고 후보는 바로 이 사이트! 그냥 너무 화려하지도 않고 반응형으로 만들어져서 모바일로도 보기 편하고
ux가 직관적이라 마음에 들었습니다. 그리고 사실 혼자 하기에 디자인적 부담도 없고. 부트스트랩을 사용해서
저도 참고하기도 편했구요.


아참. 여기서 제가 사용한 기술스택(?)을 간단하게 설명드릴게요.

1. Ruby on Rails(ROR)
2. mysql
3. Boostrap(frontend framework) 및 기타등등 라이브러리
4. AWS(EC2), Route53
5. python(크롤링)

사실 쓸줄 아는 유일한 것들이라.. 저것들을 택했습니다 -_-;; 프론트엔드 같은 경우 React나 Angular를
사용해보고 싶은 마음도 들었지만,, 배보다 배꼽이 커질꺼 같아서 일단 제외. 디플로이같은 경우에도 셋팅할줄
아는게 아마존밖에 없어요.ㅠ_ㅠ

코딩을 하는데.. 확실히 간단한 프로젝트인지라 백엔드코딩은 그냥 간단하게 끝났지만 프론트엔드가 문제더라구요..
자바스크립트 정말 1도 모르는 상태에서 메쏘드 다 찾아가면서 작성하는지라.. 객체지향적 개념은 존재하지
않습니다. 덕분에 완전 스파게티 코드에 으.. 다음에 꼭 리펙토링 해야겠습니다.

![](http://i.imgur.com/LMJialm.png)
(완전 노패턴)

정말 기억에 남는건 저러한 컬럼에서 인제 시간과 장소를 뽑아내야데 정말 패턴이 없이 들어가있어서
힘들었던 힘들게 힘들게 땜빵했던 기억이 납니다.(아직도 기억나는 패턴은 하루에 시간을 나눠서 강의하는
수업들..?)

일일히 적기에는 너무 사사롭지만 나름 고난과 역경이 많았습니다 ㅎ_ㅎ.

그리고 대충 완성될때쯤. 저는 everytime.kr 이라는 사이트의 존재를 알게되고 약간 의욕이 꺽여버립니다.

![](http://i.imgur.com/nOr1XlX.jpg)
![](http://i.imgur.com/7GPgLVh.jpg)

이런게 있는데?! 내껄 쓸리가 없는데!!!라고 소리치면서 .. 그냥 날려버릴까(?)란 생각도 해봤는데..
찬찬히 다시 뜯어보니 생각보다 제가 사용하기에 불편한점이(?) 몇몇 보이더라구요.

1. 강의계획서를 볼 수가 없다?(전공과목이야 그렇다 치더라도 교양과목은 강의계획서 없으면 ㅠ_ㅠ)
2. 검색이 불편하다.(편하게 줄임말로 검색하면 하나도 안나옴 ex)공수, 일수, 글토)
3. 시간표를 만들어 보려면 로그인을 해야해서 접근성이 떨어진다.
4. 정말 수강신청전에 사용하려는 용도보다는 일단 시간표를 만들고 남과 공유하는데 많이 쓰인다?

이러한 불만사항을 해결하고 최대한 간단하게 모바일에서도 시간표를 만들수 있도록 진행방향을 틀어서 진행하게
되었습니다. 인터페이스도 최대한 간결하게 만들었고 쓸모없는 몇몇 기능(채팅이라던가..)도 빼버렸구요.
실제로 수강신청 전에 예비 시간표를 만들어보는 역활에 충실하도록 만들었습니다.

![Imgur](http://i.imgur.com/i2EkLVF.png?1)

지금은 약 50%정도 완성된 상태이구요. 일주일동안 1400개의 시간표가 저장되었고, google analytics 기준
약 2500명의 유저가 사용했다고 나오내요. 어.. 많은건지 적은건지는 잘 모르겠지만 가끔씩 친구들이나 후배들이
잘 쓰고 있다는 말을 들으면 뿌듯합니다 ㅠ_ㅠ.. 아직 생각만 해놓고 구현하지 못한 부분도 많고 구현은 해놨는데
뭔가 미비한거 같아서 공개 안한부분도 많은데 진짜 수강신청이나 다음학기전에는 완성시킬 생각입니다!

처음으로 남이 사용할만한 서비스를 기획해서 제작해봐서 느낀점도 많았고 즐거웠던 경험이었습니다.
허접한글 읽어주셔서 감사합니다!
