---
title: "[ML / ML 개요] ML 경진대회를 임하는 방법"
categories:
  - ml_in_practice
tags:
  - 부스트캠프
  - AITech
  - recsys
  - ML
  - EDA
  - Feature_engineering
  - kaggle
  - dacon
author_profile: false
use_math: true
---
요즘 온라인의 수많은 플랫폼에서 많은 ML 경진대회가 진행되고 있다.
그 중 개인적으로 처음 ML 대회를 진행해보는 만큼, 이에 앞서 유념하고 가면 좋을 부분에 대해 정리해 보고자 한다.<br><br>

## 0. Introduction
- ML 경진대회 → 여러 질문들을 스스로에게 던져보며 <mark style="background: #FFF3A3A6;">데이터 문제 해결 능력</mark>을 키우기 위한 것
	- 어떻게 문제에 접근해야함?
		- For EDA
	- 데이터를 살펴보고 처리하는 방식은?
		- 경진대회를 임하기 전에, 선수 과정으로서 도메인 지식 학습
	- 어떠한 모델을 선정해야 하지?
		- 통계/ML/DL 모델 등
	- 최종적으로, 모델 성능 고도화는 어떻게 이루지?
		- For Tunning<br><br>
- 경진대회를 통한 AI 및 데이터 학습이 파워풀한 이유
	1. 경진대회는 <mark style="background: #FFF3A3A6;">실제 산업에서 풀어야 하는 제</mark>들이 포함되어 있음
	2. 팀원과의 수월한 협업을 위해서는 <mark style="background: #FFF3A3A6;">실험관리</mark>가 중요함 → 경진대회는 협업을 하며 다른 사람들과 코드 공유를 통해 실전 테크닉을 경험하게 되는 기회
		- 타인의 코드, idea의 feedback 및 공유를 통한 성장의 기회
	3. 관심있는 분야의 대회 참여를 통해 <mark style="background: #FFF3A3A6;">커리어에 맞는 데이터 경험</mark>을 쌓을 수 있음
		- + ML / DL 기초 다지기<br><br>
- 일반적인 경진대회 진행 프로세스
	1. EDA 및 인사이트 얻기
		- 탐색적 Data 분석
	2. Feature Engineering
		- 영역이 넓음
		- 인사이트 구현에 한계 → 잘 학습할 수 있도록 변수 표현력을 높여줌
	3. 모델 개발
		- 실제 학습 단계
		- 사용할 모델 선정
	4. 모델 feature 및 성능 확인
	5. Discussion 및 Feedback 확인<br><br>

## 1. 대회 배경 지식 습득하기
### 문제 및 배경 파악
- 문제 + 이 문제를 <mark style="background: #FFF3A3A6;">왜 해결해야 하는지에 관한 배경</mark> 포함
	- 도메인 별, 해당 문제가 발생한 배경을 이해하고 문제를 푸는 것은 큰 차이
	- 데이터에 대한 깊은 이해 + 문제 해결을 위한 힌트<br><br>
- 대회 시작 전 자가 진단 → 능동적인 사고를 기반으로 아래의 질문에 대해 한 번씩 짚어보기
	- 대회서 제시하는 문제가 명확한가? 추가적인 문제 정의는 필요 없나?
	- 어떤 방식으로 모델링 해야할까? 어떤 모델이 적절한가?
	- 추가적으로 학습해 두어야 할 도메인 지식은 없나? 있다면 어떤 방식으로 학습할까?<br><br>

### 평가 지표
- 대회의 평가지표는 <mark style="background: #FFF3A3A6;">일반적으로 고정</mark>
- 그러나 대회 진행과정에서 <mark style="background: #FFF3A3A6;">정해진 평가지표로만 모델을 평가</mark>한다면 <u>적절치 않을 수 있음</u> → 현업에서도 마찬가지
	- <u>풀고자 하는 문제</u> / <u>데이터가 갖고 있는 문제</u>에 따라 <mark style="background: #FFF3A3A6;">추가적 지표를 사용</mark>해야 할 수 있음<br><br>

## 2. 학습을 위한 프로세스
### EDA(탐색적 데이터 분석)
- EDA의 중요성
	- 주어진 데이터 이해에 큰 역할
	- 데이터의 품질 평가
	- 변수 간 관계 분석도 가능 → Feature Eng.에 대한 큰 힌트<br><br>
- 데이터에 대한 이해
	- 데이터에 대한 <mark style="background: #FFF3A3A6;">구조</mark>를 파악할 수 있음
	- 변수의 기본 통계랑 확인 가능
		- 정규성 / 변수 간 종속성 여부 등
- 데이터 품질 평가 및 변수 분석
	- 데이터 품질 평가 → <mark style="background: #FFF3A3A6;">이상치 및 결측치</mark> 탐색
	- 변수 간 관계 분석 → 변수 간 상관관계 / 상관관계 시각화(타겟 변수와의 관계)
- 모델링 방향성 설정
	- 데이터 전처리 계획
	- 핵심 인사이트 도출<br><br>

### Feature Engineering
- Feature Engineering의 중요성
	- 변수의 표현력 향상: 모델 예측력 향상
	- 데이터 변환: 모델 학습을 용이하게 할 수 있도록
	- 데이터 정제: 모델 안정성 향상(결측값 / 이상치)
- Feature Engineering을 통해 무엇을 하나?
	- 새로운 변수 생성
	- 기존 변수 변형
	- 데이터 전처리(결측값 처리 / 이상치 수정 등)<br><br>

## 3. 좋은 모델을 위한 프로세스
성능이 우수한 모델을 선택하기 위해서는 어떻게 하면 좋을까?<br><br>
### 모델 선택
- No Free Lunch Theorem → "100% 정답은 없다"
	- 모든 ML 알고리즘이 모든 문제에서 동일한 성능을 보이지 못함
	- 데이터의 <mark style="background: #FFF3A3A6;">분포 / 크기 / 변수</mark>의 종류에 따라 모델 선택이 달라짐
- 해결하고자 하는 문제들의 유형: Classification / Regression / Clustering
	- 지도 학습
		- Classification(분류): 이메일 스팸 분류 / 질병 진단 등
		- Regression(회귀): 주택 가격 예측 / 매출 예측 등
	- 비지도 학습
		- Clustering(군집화): 고객 세분화 / 문서 군집화 등
- Tree 기반 모델 (Random Forest / XGBoost / LightGBM / CatBoost 등)
	- 정형 데이터 처리에는 DL 모델보다 좋다고 알려짐
	- 높은 예측 성능
	- 유연성
	- 해석 용이 → 사람이 인지하기 편함
	- 빠른 학습 및 예측 속도 → 병렬로 수행(속도 향상)
- <mark style="background: #FFF3A3A6;">실험 정신</mark>
	- 결국, <mark style="background: #FFF3A3A6;">실험에 기반하여 가장 좋은 모델을 선택</mark>하는 것이 가장 합리적이면서 현실적
	- 다양한 모델 실험 / 최적의 모델 선정<br><br>

### 모델 검증 프로세스
- 검증 프로세스의 필요성
	- 결국, 우리가 만들고자 하는 모델은 Overfitting 되지 않은 일반화된 모델
	- 과거가 아닌, 미래를 잘 예측하는 모델이 필요
		- "미래" → Label이 없음 / 검증 데이터 분할 기법
- 검증 프로세스 구축 단계
	- Valid 데이터 분할
		- 학습 데이터 중, 절반은 Unseen → 추후 넣어보기
	- 교차 검증
		- 전체 데이터 검증을 위해 필요
	- <mark style="background: #FFF3A3A6;">데이터 누수 방지</mark>
		- Valid 데이터는, 반드시 <mark style="background: #FFF3A3A6;">train 데이터에 노출되면 안됨</mark> → 이를 방지하기 위한 기법 존재
	- 균형 잡힌 데이터 분할
		- 예측 class 분포가 균형적으로 분할될 수 있도록 → 계층적 데이터 분할<br><br>
- 반드시 놓치지 말고 검증해야 하는 사항들
	- 데이터 전처리 시, <mark style="background: #FFF3A3A6;">valid data의 unseen 상태</mark>를 보장하는지
	- Overfitting 방지 기법 고려
	- 평가 지표 선택시, 반드시 해결하고자 하는 문제에 알맞는 평가 지표를 선택해야 함<br><br>

## 4. 더 높은 성능을 위한 프로세스
### 하이퍼 파라미터 튜닝
- 모델 별 사용하는 설정값
- 모델 별로 매우 다양
- 사용자가 직접 설정하는 파라미터
- 트리 기반 모델은 어느 정도 유사한 하이퍼 파라미터 사용<br><br>

### 앙상블
- '모델 앙상블' → 여러 개의 모델의 <mark style="background: #FFF3A3A6;">예측 값을 혼합</mark>하여 더 좋은 결과를 이끌어 내는 기법
- 모델 별 약점 보완 / 강점 결합
- 단순 예측 값 평균하는 것이나 섞는 것만으로도 성능 향상 가능