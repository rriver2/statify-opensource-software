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

# 각 컬럼의 고유값 출력
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
