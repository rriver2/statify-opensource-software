# data-category.py
import pandas as pd

# CSV 파일 읽기
df = pd.read_csv('booking_data.csv')

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
    'Driver Ratings': 0.5,      # 0.5 단위
    'Customer Rating': 0.5,     # 0.5 단위
    'Booking Value': 100,       # 100 단위
    'Ride Distance': 5,         # 5km 단위
    'Avg VTAT': 5,              # 5분 단위
    'Avg CTAT': 5               # 5분 단위
}

# 범주형 컬럼 출력
print("\n" + "="*80)
print("범주형 데이터 분석")
print("="*80)

for column in categorical_columns:
    print(f"\n{'='*60}")
    print(f"Column: {column}")
    print(f"{'='*60}")
    unique_values = df[column].unique()
    print(f"총 {len(unique_values)}개의 고유값:")
    for value in unique_values:
        print(f"  - {value}")
    print(f"\n값별 개수:")
    print(df[column].value_counts())

# 범위형 컬럼 출력
print("\n\n" + "="*80)
print("범위형 데이터 분석 (구간별 분포)")
print("="*80)

for column, bin_size in range_columns.items():
    print(f"\n{'='*60}")
    print(f"Column: {column} (단위: {bin_size})")
    print(f"{'='*60}")

    # NaN 값 제거
    data = df[column].dropna()

    if len(data) == 0:
        print("데이터가 없습니다.")
        continue

    # 최소값, 최대값 확인
    min_val = data.min()
    max_val = data.max()
    print(f"범위: {min_val:.2f} ~ {max_val:.2f}")

    # 구간 생성
    bins = []
    current = 0
    while current <= max_val + bin_size:
        bins.append(current)
        current += bin_size

    # 구간별로 그룹화
    labels = [f"{bins[i]:.1f} - {bins[i+1]:.1f}" for i in range(len(bins)-1)]
    binned_data = pd.cut(data, bins=bins, labels=labels, include_lowest=True)

    print(f"\n구간별 개수:")
    print(binned_data.value_counts().sort_index())
