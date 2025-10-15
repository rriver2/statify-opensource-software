import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

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

# 필요한 컬럼만 선택하고 'Driver asked to cancel'로 필터링
selected_columns = ['Date', 'Time', 'Reason for cancelling by Customer']
temp_df = df[selected_columns].copy()

cancel_reason_df = temp_df[
    temp_df['Reason for cancelling by Customer'] == 'Driver asked to cancel'
].copy()

# 'Date'와 'Time'을 Datetime 객체로 변환
cancel_reason_df['Date'] = pd.to_datetime(cancel_reason_df['Date'], errors='coerce')

# Time 컬럼을 datetime 객체로 변환하고, 시간(Hour)과 분(Minute)을 활용하여 30분 단위 구간 생성
cancel_reason_df['Time_dt'] = pd.to_datetime(
    cancel_reason_df['Time'], format='%H:%M:%S', errors='coerce'
)
cancel_reason_df.dropna(subset=['Time_dt'], inplace=True) # NaN 제거

# 30분 단위 구간 및 레이블 생성 (수정된 부분)

# 1. 30분 단위 구간 컬럼 생성
cancel_reason_df['Time_Bin'] = (
    cancel_reason_df['Time_dt'].dt.hour + 
    (cancel_reason_df['Time_dt'].dt.minute // 30) * 0.5
)

# 2. 30분 단위 취소 요청 수 계산
cancellation_counts_30min = cancel_reason_df['Time_Bin'].value_counts().sort_index().reset_index()
cancellation_counts_30min.columns = ['Time_Bin', 'Cancellation Count']

# 3. X축 레이블 형식 지정 (예: 10.0 -> '10:00-10:30', 10.5 -> '10:30-11:00')
def create_label(time_bin):
    start_hour = int(time_bin)
    start_minute = int((time_bin - start_hour) * 60) # 0.5 * 60 = 30
    
    end_hour = int(time_bin + 0.5)
    end_minute = int(((time_bin + 0.5) - end_hour) * 60)
    
    start_time = f"{start_hour:02d}:{start_minute:02d}"
    end_time = f"{end_hour:02d}:{end_minute:02d}"
    return f"{start_time}-{end_time}"

cancellation_counts_30min['Time Label'] = cancellation_counts_30min['Time_Bin'].apply(create_label)


# 4. 막대 그래프 생성 (30분 단위)
plt.figure(figsize=(18, 6)) # X축 레이블이 많아지므로 그래프 크기 증가
sns.barplot(
    x='Time Label', 
    y='Cancellation Count', 
    data=cancellation_counts_30min, 
    palette='viridis'
)

# 5. 그래프 설정
plt.title('Driver asked to cancel', fontsize=16)
plt.ylabel('Count', fontsize=12)
plt.xticks(rotation=90, ha='right', fontsize=8) # 48개 레이블을 수직으로 표시
plt.tight_layout()
plt.show()