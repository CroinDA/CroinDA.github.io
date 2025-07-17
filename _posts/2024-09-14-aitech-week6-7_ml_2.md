---
layout: single
title: "[ML / ML 개요] EDA / Feature Engineering"
categories:
  - ml_in_practice
tags:
  - 부스트캠프
  - AITech
  - recsys
  - ML
  - EDA
  - Feature_engineering
author_profile: false
use_math: true
---
## 1. EDA
### 개요
- EDA란?
	- 데이터를 요약하고, 주요 특성을 시각적으로2024-09-14-aitech-week6-7_ml_22024-09-14-aitech-week6-7_ml_2 탐색하는 과정
- EDA 주요 목적
	- 데이터 구조 이해
	- 이상치 / 데이터 패턴 발견
	- 가설 수립을 통한 통계 모델링의 방향 설정 → 데이터 분석을 통한 인사이트
- EDA 중요성
	- 데이터에 대한 이해도 증가 → 데이터 특성 및 구조 이해
	- 문제점을 사전에 발견 → 조기에 발견하여야 원점으로 다시 돌아오는 긴 과정을 거치지 않음
	- <mark style="background: #FFF3A3A6;">인사이트 도출</mark> → 문제 해결 초기에 탐색을 통한 유의미한 인사이트 도출
		- EDA 실시의 가장 주된 목적
		- 수많은 경험으로 얻어질 수 있는 노하우<br><br>

### EDA 단계
1. 데이터 이해
	- 데이터의 형식 / 구조 확인
	- 데이터 변수의 갯수 / 관측치 수 확인
	- 도메인 지식 파악 for training
2. 데이터 전처리
	- 결측치 및 이상치 처리
	- 데이터 <mark style="background: #FFF3A3A6;">정규화</mark> / 변환
3. 데이터 요약 및 시각화
	- 인사이트 도출
	- 모델에 필요한 가설 설정<br><br>

### 데이터 요약
- 데이터 특성 파악을 위한 기초적인 통계량
	- 수치형 변수 vs 범주형 변수
		- 수치형 변수의 기초 통계량
			- 중심 경향성 측정 → 평균 / 중앙값 / 최빈값
			- 산포 측정 → 분산 / 표준편차 / 범위
			- 관계성 → 상관관계
		- 범주형 변수의 데이터 요약
			- 도수분포표 → 범주형 변수의 도수분포 요약
- 상관관계?
	- 두 변수 간 관게를 나타내는 통계적 개념
	- <mark style="background: #FFF3A3A6;">상관계수</mark>(-1~1)를 통해 관계의 정도 표현
	- 양의 상관관계 vs 음의 상관관계
		- 양의 상관관계 → 상호 간의 변수가 정비례 관계
		- 음의 상관관계 → 상호 간의 변수가 반비례 관계<br><br>

### 데이터 시각화
<mark style="background: #FFF3A3A6;">데이터를 쉽게 이해</mark>하기 위해 다양한 시각화 기법 활용
1. 단변량 분석
	- 수치형 데이터 시각화 → 히스토그램 / 박스 플롯 등
		![image1](../../images/2024-09-14-aitech-week6-7_ml_2/image1.png)
	- 범주형 데이터 시각화 → 막대 그래프 / 파이 차트 등
		![image2](../../images/2024-09-14-aitech-week6-7_ml_2/image2.png)
		
2. 이변량 분석
	- 수치형 변수 간의 관계 → 산점도 / 상관 행렬도 등
		![image3](../../images/2024-09-14-aitech-week6-7_ml_2/image3.png)
	- 수치형 변수 ↔ 범주형 변수 간의 관계 → 박스 플롯 / 바이올린 플롯 등(분포 파악에 용이)
		![image4](../../images/2024-09-14-aitech-week6-7_ml_2/image4.png)
		
- 기타 데이터 시각화 방법은 다양 → 다양한 도구를 적절히 활용하는 방법 경험하며 익히기
	![image5](../../images/2024-09-14-aitech-week6-7_ml_2/image5.png)
	![image6](../../images/2024-09-14-aitech-week6-7_ml_2/image6.png)<br><br>

## 2. Feature Engineering
### 개요
- Feature Engineering?
	- 모델의 성능 향상을 위해, 데이터를 변환하고 새로운 유용한 특징을 생성하는 과정
		- 새로운 feature 생성
		- 기존 feature 변형
- Feature Engineering 주요 목적
	- 모델 성능 향상
	- 모델 설명력 향상
	- 데이터 표현력 향상
	- 예측 정확도 증대
- Feature Engineering 주요 특징
	- Feature Creation
		- 새 특성 도출 → 도메인 지식을 통한 <mark style="background: #FFF3A3A6;">유의미한 특징</mark> 생성
			- ex) 날짜 데이터가 있음 → 이를 기반으로 요일 / 월 / 연도 등의 새로운 특성 생성
		- Interaction Terms → 변수 간 상호작용 반영한 특성
			- 데이터 자체의 통계량 / 섞기 등의 기법
			- ex)`df['age_income'] = df['age'] * df['income']`
	- Feature Selection
		- 불필요한 특성 제거 → 상관관계 파악, 중요도 순위 결정 등
		- 차원 축소 → PCA, LDA 등
			- 필요한 feature만 남김<br><br>

### Feature Engineering 예시: Titanic: Machine Learning from Disaster
데이터셋 개요
- Kaggle 제공
- 구성: train.csv / test.csv 등
- 주요 활용처: Kaggle / Data 및 ML 입문교육<br><br>
- Example 데이터 from Titanic
	- Feature: Survived / SibSp / Parch / Fare
		- Survived: 생존 여부(생존: 1 / 사망: 0)
			- <mark style="background: #FFF3A3A6;">Target 데이터</mark>
		- SibSp: 타이타닉에 동승한 형제자매/배우자 수
		- Parch: 타이타닉에 동승한 부모/자녀 수
		- Fare: 승객 지불 운임
		![image7](../../images/2024-09-14-aitech-week6-7_ml_2/image7.png)
	- Target 변수를 잘 설명할 수 있는 변수 찾기
		- Target → "Survived"
		- Fare 열을 기준으로 13등분한 변수 생성 → 보기 힘들던 패턴도 쉽게 파악 가능
		- Fare가 커질 수록, 생존 확률이 높아진다고 해석 가능
		![image8](../../images/2024-09-14-aitech-week6-7_ml_2/image8.png)
	- 데이터 이해를 통한 새로운 변수 생성
		- SibSp: 형제자매, 배우자 수 / Parch: 부모, 자녀의 수
		- 이를 <mark style="background: #FFF3A3A6;">합쳐서</mark> Family_Size라는 열 생성 가능
		- 이를 <mark style="background: #FFF3A3A6;">그룹화하여</mark> Alone, Small, Medium, Large 라는 열을 만들 수 있음
		![image9](../../images/2024-09-14-aitech-week6-7_ml_2/image9.png)<br><br>

### 중요한 변수
Feature Engineering은 결국 새로운 변수를 만들어내는 일이다. 하지만, 중요한 변수를 만드는 것이 핵심이기 때문에 어떤 변수가 중요한지 판단하는 것은 중요하다.<br><br>
- 중요한 변수를 2가지 관점으로 분류
	- 예측 성능 측면
		- 변별력: 변수는 목표 변수(target)와 <mark style="background: #FFF3A3A6;">강한 상관관계</mark>를 지녀야 함
		- 정보량: 변수는 모델이 학습할 <mark style="background: #FFF3A3A6;">충분한 양의 정보를 제공</mark>해야 함
	- 인사이트 도출 측면 → 정량화하기 어려운 단점이 있긴 함
		- <mark style="background: #FFF3A3A6;">해석 가능성</mark>: 변수가 무엇을 의미하는지 <mark style="background: #FFF3A3A6;">쉽게 이해</mark>해야 함
		- 변수 대표성: 변수가 데이터의 <mark style="background: #FFF3A3A6;">본질적 특성</mark>을 잘 나타내야 함
- SHAP value
	- ML 모델에서, 각 feature가 예측 결과에 얼마만큼 기여했는지 정량적으로 설명해주는 값
		- 모델의 예측값이 나왔을 때, 그 예측에서 <mark style="background: #FFF3A3A6;">어느 feature가 얼마나 중요한 역할</mark>을 하였는지 알 수 있게 해줌
	- ex) 집값 추정 모델, 고양이 유무에 따른 비교
		- 다른 변수 전부 고정 / 고양이 허용 유무에 따른 차이 → € 10,000 차이
		- 마찬가지로 다른 모든 변수의 조합에서 고양이 허용 유무가 예측값에 주는 차이 계산 → 변수의 중요성 파악 가능
			![image10](../../images/2024-09-14-aitech-week6-7_ml_2/image10.png)
- Permutation Importance
	- ML에서 각 Feature가 모델의 예측에 미치는 상대적 중요도를 평가하는 방법
	- 변수의 중요성을 파악하는 방법론
		- 적합한 모델에 대해, 변수를 랜덤하게 섞어 예측 성능이 얼마나 하락했는지 파악
		- 기본 가정: "중요 데이터를 포함하고 섞었을 경우, 성능 하락이 클 것이다."
	- ex) 변수에 대해 permutation 진행
		- 예측오차 크게 하락
		![image11](../../images/2024-09-14-aitech-week6-7_ml_2/image11.png)
		- 성능은 크게 하락되지 않았음 → 이전의 변수가 더 중요한 변수임을 파악
		![image12](../../images/2024-09-14-aitech-week6-7_ml_2/image12.png)<br><br>

