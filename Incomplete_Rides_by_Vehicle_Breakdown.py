# data-category.py
import pandas as pd

import seaborn as sns
import matplotlib.pyplot as plt

# CSV 파일 읽기
df = pd.read_csv('booking_data_converted.csv')

# 범주형 컬럼 리스트
categorical_columns = [
    'Booking Status',
    'Vehicle Type',
    'Cancelled Rides by Customer',
    'Reason for cancelling by Customer',
    'Cancelled Rides by Driver',
    'Driver Cancellation Reason',
    'Incomplete Rides',
    'Incomplete Rides Reason',
    'Payment Method'
]

# 범위형 컬럼 리스트 (구간으로 나누어 분석)
range_columns = {
    'Driver Ratings (1-5 scale)': 0.5,      # 0.5 단위
    'Customer Rating (1-5 scale)': 0.5,     # 0.5 단위
    'Booking Value (in INR)': 100,       # 100 단위
    'converted into USD (2025-09-29)': 1,       # 달러 단위
    'converted into KRW (2025-09-29)': 1000,        #원 단위
    'Ride Distance (in km)': 5,         # 5km 단위
    'Avg VTAT (in minutes)': 5,              # 5분 단위
    'Avg CTAT (in minutes)': 5               # 5분 단위
}

# 1. 각 차량 타입별 전체 운행 건수 계산 (Total Rides)
total_rides_by_vehicle = df.groupby('Vehicle Type').size().reset_index(name='Total Rides')

# 2. 고장 건수 계산
breakdown_counts = df[
    (df['Incomplete Rides'] == 1) & 
    (df['Incomplete Rides Reason'] == 'Vehicle Breakdown')
].groupby('Vehicle Type').size().reset_index(name='Breakdown Count')


# 3. 전체 운행 건수 데이터프레임에 고장 건수만 병합
rate_df = total_rides_by_vehicle.merge(breakdown_counts, on='Vehicle Type', how='left').fillna(0)

# 데이터 타입 정리
rate_df['Breakdown Count'] = rate_df['Breakdown Count'].astype(int)

# 4. 고장율 계산
rate_df['Breakdown Rate'] = (rate_df['Breakdown Count'] / rate_df['Total Rides']) * 100

# 5. 소수점 둘째 자리까지 반올림
rate_df['Breakdown Rate'] = rate_df['Breakdown Rate'].round(2)

# 6. 최종 결과 출력 및 정렬
print("차종별 고장율 (Breakdown Rate)")

# 고장율 기준으로 내림차순 정렬하여 출력
# 필요한 컬럼만 선택하여 출력합니다.
final_breakdown_rate = rate_df[['Vehicle Type', 'Total Rides', 'Breakdown Count', 'Breakdown Rate']].sort_values(
    by='Breakdown Rate', ascending=False
)
print(final_breakdown_rate)


# incomplete 레코드 추출 (이 중에서 'Vehicle Breakdown'만 추려서 출력)
Incomplete_Rides_df = df[(df['Incomplete Rides'] == 1) & (df['Incomplete Rides Reason'] == 'Vehicle Breakdown')] 

# 차량 타입과 완전히 종료되지 않은 주행을 추출하여 데이터 프레임 생성
selected_columns_df = Incomplete_Rides_df[[
    'Vehicle Type',
    'Incomplete Rides Reason',
]]
# Vehicle Type과 Incomplete Rides Reason을 기준으로 그룹화하고 개수를 세어 출력
reason_counts_by_vehicle = selected_columns_df.groupby([
    'Vehicle Type', 
    'Incomplete Rides Reason'
]).size().reset_index(name='Count')

# Vehicle Type에 대해 오름차순 정렬
print("\n=== 차량종류별 Incomplete Rides Reason 카운트 ===")
print(reason_counts_by_vehicle.sort_values(by='Count'))


# 1. Matplotlib figure 초기화
plt.figure(figsize=(10, 6)) 

# 2. Seaborn 막대 그래프 생성
sns.barplot(
    x='Count', 
    y='Vehicle Type', 
    data=reason_counts_by_vehicle,
    palette='viridis'
)

# 3. 그래프 제목 및 라벨 설정
plt.title('Vehicle Breakdown')
plt.xlabel('Count')
plt.ylabel('Vehicle Type')

# 4. 그래프 출력
plt.show()