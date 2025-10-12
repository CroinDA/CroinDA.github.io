---
layout: single
title: "[예시] Transformer 모델 이해하기"
categories:
  - nlp_basic
tags:
  - Transformer
  - NLP
  - Deep Learning
author_profile: false
use_math: true
---

Transformer는 2017년 "Attention is All You Need" 논문에서 처음 소개된 모델로, 기존의 RNN이나 LSTM을 사용하지 않고 Attention 메커니즘만으로 구성된 혁신적인 아키텍처입니다.

## Self-Attention 메커니즘

Self-Attention은 입력 시퀀스의 각 요소가 다른 모든 요소와의 관계를 학습할 수 있게 하는 핵심 메커니즘입니다.

$$
Attention(Q, K, V) = softmax(\frac{QK^T}{\sqrt{d_k}})V
$$

여기서:

- Q (Query): 질의 벡터
- K (Key): 키 벡터
- V (Value): 값 벡터
- $d_k$: 키 벡터의 차원
## Multi-Head Attention

여러 개의 Attention을 병렬로 수행하여 모델이 다양한 표현을 학습할 수 있게 합니다:

1. 여러 가지 관점에서 정보를 파악
1. 모델의 표현력 향상
1. 병렬 처리로 효율성 증대
## Position-wise Feed Forward

각 위치에서 독립적으로 적용되는 완전 연결 층입니다:

```python
def feed_forward(x):
    return max(0, x @ W1 + b1) @ W2 + b2
```

## 주요 특징

- **병렬 처리**: RNN과 달리 순차적 처리가 필요 없음
- **장거리 의존성**: 거리에 관계없이 모든 위치 간 직접 연결
- **확장성**: BERT, GPT 등 다양한 모델의 기반
## 응용 분야

- 기계 번역
- 텍스트 요약
- 질의응답
- 텍스트 생성