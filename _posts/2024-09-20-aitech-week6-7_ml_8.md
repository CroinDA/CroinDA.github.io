---
title: "[ML/모델 튜닝 기법] 하이퍼파라미터 튜닝 (Hyperparameter Tune)"
categories:
  - ml_in_practice
tags:
  - 부스트캠프
  - AITech
  - recsys
  - ML
  - 하이퍼파라미터
  - 튜닝
  - Hyperparameter
  - optuna
  - wandb
author_profile: false
use_math: true
---
## 1. Hyperparameter Optimization
### HPO(Hyperparameter Optimization)
- 하이퍼파라미터 최적화
- Hyperparameter vs Parameter
	![image1](../../images/2024-09-20-aitech-week6-7_ml_8/image1.png)
	- Hyperparameter
		- 모델 학습 과정의 디자인에 반영되는 값
		- 학습 시작 전 미리 설정되는 구성 변수
		- <mark style="background: #FFF3A3A6;">직접 조절 가능</mark>한 변수
	- Parameter
		- 모델 내부에서 결정되는 변수
		- 데이터로부터 학습되고 조정되는 값
		- <mark style="background: #FFF3A3A6;">직접 조절 불가능</mark>한 변수
- HPO가 필요한 이유
	- 모델 성능 향상
		- 적절한 하이퍼파라미터 선택은 모델 성능에 큰 영향 미침
	- 학습 시간 감소
		- 효율적인 하이퍼파라미터 조정을 통해 학습 시간과 계산 자원이 감소할 수 있음
	- 모델 일반화
		- 잘 최적화된 하이퍼파라미터는 실제 데이터에 일반화될 수 있도록 도와 Overfitting을 줄일 수 있음<br><br>

### Hyperparameter Tune Method
- Hyperparameter search
	- 주어진 데이터에 대해, 어떤 하이퍼파라미터 조합에서 성능이 좋은지 찾기 → "<mark style="background: #FFF3A3A6;">직접 실험</mark>하며"
	![image2](../../images/2024-09-20-aitech-week6-7_ml_8/image2.png)
- Grid Search
	- <mark style="background: #FFF3A3A6;">모든 하이퍼파라미터 조합</mark>을 대상으로 모델 학습 및 평가 → 가장 우수한 성능조합 탐색
		- 가능한 모든 하이퍼파라미터 조합 탐색 → 모든 하이퍼파라미터를 찾는데 유용
		- 모든 조합을 탐색하기 때문에 계산량이 매우 높아질 수 있음
		![image3](../../images/2024-09-20-aitech-week6-7_ml_8/image3.png)
- Random Search
	- 가능한 하이퍼파라미터의 값들 중, <mark style="background: #FFF3A3A6;">무작위로 선택하여 모델을 평가</mark>하는 방식
		- 시간적으로 효율적인 탐색 가능
		- 랜덤으로 탐색을 진행하는 만큼, 최적해를 찾을 확률은 Grid Search에 비해 낮음
	![image4](../../images/2024-09-20-aitech-week6-7_ml_8/image4.png)
- Bayesian Search
	- <mark style="background: #FFF3A3A6;">하이퍼파라미터↔모델 성능 간 관계성</mark>을 고려한 최적의 하이퍼파라미터 조합을 찾는 방법
		- Iteration을 돌면서, <mark style="background: #FFF3A3A6;">하이퍼파라미터에 따른 모델성능에 대한 함수</mark> 추정 → Hyperparameter 탐색
		![image5](../../images/2024-09-20-aitech-week6-7_ml_8/image5.png)<br><br>

## 2. HPO Tools
### WandB Sweep
- 소개
	- WandB의 <mark style="background: #FFF3A3A6;">"Sweep" 기능</mark> → 하이퍼파라미터 튜닝 및 결과 시각화(자동 온라인 기록)
	![image6](../../images/2024-09-20-aitech-week6-7_ml_8/image6.png)<br><br>

### Optuna
- 소개
	- ML 모델의 하이퍼파라미터 최적화를 위해 만들어진 오픈소스 프레임워크
	- WandB의 Sweep과 거의 유사한 기능 제공
	- 웹 보다는, <mark style="background: #FFF3A3A6;">notebook 상에서 visualization</mark>을 하는 데에 초점
	- Hyperparameter만 최적화할 수 있을 뿐 아니라, <mark style="background: #FFF3A3A6;">모델도 함께 Optimization 대상</mark>으로 설정할 수 있음<br><br>

