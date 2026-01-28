---
title: "[NLP 이론 / RNN] RNN의 문제점 개선: LSTM, GRU"
categories:
  - nlp_basic
tags:
  - 부스트캠프
  - AITech
  - AIBasic
  - 자연어처리
  - RNN
  - LSTM
  - GRU
author_profile: false
use_math: true
---
## RNN의 문제점과 그 대안
RNN의 가장 큰 문제점: Exploding Gradient / Vanishing Gradient            
- Exploding Gradient
	- RNN을 BPTT하는 과정에서 장기간 기울기가 흐르면서 기울기가 폭발하는 현상
	- 해결책: Gradient cliping
		1. 신경망에서 사용하는 모든 매개변수에 대한 기울기를 하나로 처리한다고 가정
		2. threshold 설정
		3. gradient의 L2 norm이 threshold를 초과하면 → 기울기를 아래의 수식처럼 수정
			- if $\Vert \hat{g} \Vert \geq threshold:$
			- $\hat{g} = \frac{threshold}{\Vert \hat{g} \Vert}\hat{g}$
- Vanishing Gradient
	- RNN을 BPTT하는 과정에서 장기간 기울기가 흐르면서 기울기가 소실되는 현상
	- 해결책: 아키텍처를 근본적으로 수정 → ==게이트를 추가한 RNN== 등장
	- 게이트를 추가한 대표 아키텍처: LSTM, GRU 등<br><br>

## LSTM
RNN과 달리, memory state를 따로 두어 ==LSTM 전용의 기억 메커니즘==을 따로 생성해줌         
$c$ : 기억 셀(memory state)
- 데이터를 자기 자신으로만(=LSTM 계층 내에서만) 주고 받음
- LSTM 계층 내에서만 완결되고, 다른 계층으로는 출력하지 않음