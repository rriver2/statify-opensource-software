# gaeunLeeVisual.py
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

# 한글 폰트 설정 (Mac)
plt.rcParams['font.family'] = 'AppleGothic'
plt.rcParams['axes.unicode_minus'] = False

# CSV 파일 읽기
df = pd.read_csv('booking_data_converted.csv')

# 그래프 스타일 설정
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (12, 8)

# 1. Booking Status 분포
def plot_booking_status():
    plt.figure(figsize=(10, 6))
    df['Booking Status'].value_counts().plot(kind='bar', color='skyblue')
    plt.title('Booking Status Distribution', fontsize=16, fontweight='bold')
    plt.xlabel('Status', fontsize=12)
    plt.ylabel('Count', fontsize=12)
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()
    print("✓ Booking Status 그래프 표시 완료")

# 2. Vehicle Type 분포
def plot_vehicle_type():
    plt.figure(figsize=(10, 6))
    df['Vehicle Type'].value_counts().plot(kind='bar', color='lightcoral')
    plt.title('Vehicle Type Distribution', fontsize=16, fontweight='bold')
    plt.xlabel('Vehicle Type', fontsize=12)
    plt.ylabel('Count', fontsize=12)
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()
    print("✓ Vehicle Type 그래프 표시 완료")

# 3. Payment Method 분포
def plot_payment_method():
    plt.figure(figsize=(10, 6))
    payment_counts = df['Payment Method'].value_counts()
    colors = sns.color_palette('pastel')[0:len(payment_counts)]
    plt.pie(payment_counts, labels=payment_counts.index, autopct='%1.1f%%', colors=colors, startangle=90)
    plt.title('Payment Method Distribution', fontsize=16, fontweight='bold')
    plt.tight_layout()
    plt.show()
    print("✓ Payment Method 그래프 표시 완료")

# 4. Driver Ratings 분포
def plot_driver_ratings():
    plt.figure(figsize=(10, 6))
    plt.hist(df['Driver Ratings (1-5 scale)'].dropna(), bins=20, color='lightgreen', edgecolor='black', alpha=0.7)
    plt.title('Driver Ratings Distribution', fontsize=16, fontweight='bold')
    plt.xlabel('Rating', fontsize=12)
    plt.ylabel('Frequency', fontsize=12)
    plt.axvline(df['Driver Ratings (1-5 scale)'].mean(), color='red', linestyle='--', linewidth=2, label=f'Mean: {df["Driver Ratings (1-5 scale)"].mean():.2f}')
    plt.legend()
    plt.tight_layout()
    plt.show()
    print("✓ Driver Ratings 그래프 표시 완료")

# 5. Customer Rating 분포
def plot_customer_rating():
    plt.figure(figsize=(10, 6))
    plt.hist(df['Customer Rating (1-5 scale)'].dropna(), bins=20, color='lightyellow', edgecolor='black', alpha=0.7)
    plt.title('Customer Rating Distribution', fontsize=16, fontweight='bold')
    plt.xlabel('Rating', fontsize=12)
    plt.ylabel('Frequency', fontsize=12)
    plt.axvline(df['Customer Rating (1-5 scale)'].mean(), color='red', linestyle='--', linewidth=2, label=f'Mean: {df["Customer Rating (1-5 scale)"].mean():.2f}')
    plt.legend()
    plt.tight_layout()
    plt.show()
    print("✓ Customer Rating 그래프 표시 완료")

# 6. Booking Value vs Ride Distance 산점도
def plot_booking_value_vs_distance():
    plt.figure(figsize=(10, 6))
    plt.scatter(df['Ride Distance (in km)'], df['Booking Value (in INR)'], alpha=0.5, c='purple')
    plt.title('Booking Value vs Ride Distance', fontsize=16, fontweight='bold')
    plt.xlabel('Ride Distance (km)', fontsize=12)
    plt.ylabel('Booking Value (INR)', fontsize=12)
    plt.tight_layout()
    plt.show()
    print("✓ Booking Value vs Distance 그래프 표시 완료")

# 7. 취소 사유 분석 (Customer)
def plot_customer_cancellation_reasons():
    cancellation_data = df[df['Cancelled Rides by Customer'] == 'Yes']['Reason for cancelling by Customer'].value_counts()
    if len(cancellation_data) > 0:
        plt.figure(figsize=(12, 6))
        cancellation_data.plot(kind='barh', color='salmon')
        plt.title('Customer Cancellation Reasons', fontsize=16, fontweight='bold')
        plt.xlabel('Count', fontsize=12)
        plt.ylabel('Reason', fontsize=12)
        plt.tight_layout()
        plt.show()
        print("✓ Customer Cancellation Reasons 그래프 표시 완료")
    else:
        print("⚠ Customer Cancellation 데이터가 없습니다.")

# 8. 취소 사유 분석 (Driver)
def plot_driver_cancellation_reasons():
    cancellation_data = df[df['Cancelled Rides by Driver'] == 'Yes']['Driver Cancellation Reason'].value_counts()
    if len(cancellation_data) > 0:
        plt.figure(figsize=(12, 6))
        cancellation_data.plot(kind='barh', color='lightblue')
        plt.title('Driver Cancellation Reasons', fontsize=16, fontweight='bold')
        plt.xlabel('Count', fontsize=12)
        plt.ylabel('Reason', fontsize=12)
        plt.tight_layout()
        plt.show()
        print("✓ Driver Cancellation Reasons 그래프 표시 완료")
    else:
        print("⚠ Driver Cancellation 데이터가 없습니다.")

# 9. 시간대별 분석
def plot_time_analysis():
    df_time = df.copy()
    df_time['Booking Time'] = pd.to_datetime(df_time['Date'] + ' ' + df_time['Time'])
    df_time['Hour'] = df_time['Booking Time'].dt.hour

    plt.figure(figsize=(12, 6))
    hourly_bookings = df_time['Hour'].value_counts().sort_index()
    hourly_bookings.plot(kind='line', marker='o', color='teal', linewidth=2)
    plt.title('Bookings by Hour of Day', fontsize=16, fontweight='bold')
    plt.xlabel('Hour', fontsize=12)
    plt.ylabel('Number of Bookings', fontsize=12)
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.show()
    print("✓ Hourly Bookings 그래프 표시 완료")

# 10. 종합 대시보드
def create_dashboard():
    fig, axes = plt.subplots(2, 2, figsize=(16, 12))

    # Booking Status
    df['Booking Status'].value_counts().plot(kind='bar', ax=axes[0, 0], color='skyblue')
    axes[0, 0].set_title('Booking Status', fontweight='bold')
    axes[0, 0].set_xlabel('Status')
    axes[0, 0].set_ylabel('Count')

    # Vehicle Type
    df['Vehicle Type'].value_counts().plot(kind='bar', ax=axes[0, 1], color='lightcoral')
    axes[0, 1].set_title('Vehicle Type', fontweight='bold')
    axes[0, 1].set_xlabel('Vehicle Type')
    axes[0, 1].set_ylabel('Count')

    # Driver Ratings
    axes[1, 0].hist(df['Driver Ratings (1-5 scale)'].dropna(), bins=20, color='lightgreen', edgecolor='black')
    axes[1, 0].set_title('Driver Ratings', fontweight='bold')
    axes[1, 0].set_xlabel('Rating')
    axes[1, 0].set_ylabel('Frequency')

    # Booking Value vs Distance
    axes[1, 1].scatter(df['Ride Distance (in km)'], df['Booking Value (in INR)'], alpha=0.5, c='purple')
    axes[1, 1].set_title('Booking Value vs Distance', fontweight='bold')
    axes[1, 1].set_xlabel('Ride Distance (km)')
    axes[1, 1].set_ylabel('Booking Value (INR)')

    plt.tight_layout()
    plt.show()
    print("✓ Dashboard 표시 완료")

# 메인 실행
if __name__ == "__main__":
    print("\n" + "="*80)
    print("GAEUN LEE - BOOKING DATA VISUALIZATION")
    print("="*80 + "\n")

    print("데이터 로딩 완료!")
    print(f"총 데이터 개수: {len(df)}")
    print("\n시각화를 시작합니다...\n")

    # 모든 그래프 생성
    plot_booking_status()
    plot_vehicle_type()
    plot_payment_method()
    plot_driver_ratings()
    plot_customer_rating()
    plot_booking_value_vs_distance()
    plot_customer_cancellation_reasons()
    plot_driver_cancellation_reasons()
    plot_time_analysis()
    create_dashboard()

    print("\n" + "="*80)
    print("모든 시각화 완료!")
    print("="*80)
