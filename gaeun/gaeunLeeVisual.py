# gaeunLeeVisual.py
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

# 한글 폰트 설정 (Mac)
plt.rcParams['font.family'] = 'Apple SD Gothic Neo'
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
    print("✓ Booking Status 그래프 생성 완료")

# 2. Vehicle Type 분포
def plot_vehicle_type():
    plt.figure(figsize=(10, 6))
    df['Vehicle Type'].value_counts().plot(kind='bar', color='lightcoral')
    plt.title('Vehicle Type Distribution', fontsize=16, fontweight='bold')
    plt.xlabel('Vehicle Type', fontsize=12)
    plt.ylabel('Count', fontsize=12)
    plt.xticks(rotation=45)
    plt.tight_layout()
    print("✓ Vehicle Type 그래프 생성 완료")

# 3. Payment Method 분포
def plot_payment_method():
    plt.figure(figsize=(10, 6))
    payment_counts = df['Payment Method'].value_counts()
    colors = sns.color_palette('pastel')[0:len(payment_counts)]
    plt.pie(payment_counts, labels=payment_counts.index, autopct='%1.1f%%', colors=colors, startangle=90)
    plt.title('Payment Method Distribution', fontsize=16, fontweight='bold')
    plt.tight_layout()
    print("✓ Payment Method 그래프 생성 완료")

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
    print("✓ Driver Ratings 그래프 생성 완료")

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
    print("✓ Customer Rating 그래프 생성 완료")

# 6. Booking Value vs Ride Distance 산점도
def plot_booking_value_vs_distance():
    plt.figure(figsize=(10, 6))
    plt.scatter(df['Ride Distance (in km)'], df['Booking Value (in INR)'], alpha=0.5, c='purple')
    plt.title('Booking Value vs Ride Distance', fontsize=16, fontweight='bold')
    plt.xlabel('Ride Distance (km)', fontsize=12)
    plt.ylabel('Booking Value (INR)', fontsize=12)
    plt.tight_layout()
    print("✓ Booking Value vs Distance 그래프 생성 완료")

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
        print("✓ Customer Cancellation Reasons 그래프 생성 완료")
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
        print("✓ Driver Cancellation Reasons 그래프 생성 완료")
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
    print("✓ Hourly Bookings 그래프 생성 완료")

# 10. 종합 대시보드
def create_dashboard():
    # 세로로 긴 레이아웃으로 스크롤 가능하게 설정
    fig = plt.figure(figsize=(24, 40))
    gs = fig.add_gridspec(8, 3, hspace=0.4, wspace=0.3)

    # Row 0: Title and Statistics Summary (Full Width)
    ax_title = fig.add_subplot(gs[0, :])
    ax_title.axis('off')
    stats_text = f"""
    ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
                                         GAEUN LEE - Comprehensive Booking Data Dashboard
    ═══════════════════════════════════════════════════════════════════════════════════════════════════════════

    Total Records: {len(df):,} 건  |  distance average: {df['Ride Distance (in km)'].mean():.2f} km  |  the average rate: {df['Booking Value (in INR)'].mean():.2f} INR  |
    Driver Rating: {df['Driver Ratings (1-5 scale)'].mean():.2f}/5.0  |  Customer Rating: {df['Customer Rating (1-5 scale)'].mean():.2f}/5.0
    """
    ax_title.text(0.5, 0.5, stats_text, fontsize=13, verticalalignment='center', horizontalalignment='center',
                 family='monospace', bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.3))

    # Row 1: Booking Status, Vehicle Type, Payment Method
    ax1 = fig.add_subplot(gs[1, 0])
    df['Booking Status'].value_counts().plot(kind='bar', ax=ax1, color='skyblue', edgecolor='black')
    ax1.set_title('Booking Status Distribution', fontweight='bold', fontsize=18)
    ax1.set_xlabel('Status', fontsize=14)
    ax1.set_ylabel('Count', fontsize=14)
    ax1.tick_params(labelsize=12)
    for i, v in enumerate(df['Booking Status'].value_counts()):
        ax1.text(i, v + 100, str(v), ha='center', fontsize=11)

    ax2 = fig.add_subplot(gs[1, 1])
    df['Vehicle Type'].value_counts().head(10).plot(kind='bar', ax=ax2, color='lightcoral', edgecolor='black')
    ax2.set_title('Top 10 Vehicle Types', fontweight='bold', fontsize=18)
    ax2.set_xlabel('Vehicle Type', fontsize=14)
    ax2.set_ylabel('Count', fontsize=14)
    ax2.tick_params(labelsize=12, rotation=45)

    ax3 = fig.add_subplot(gs[1, 2])
    payment_counts = df['Payment Method'].value_counts()
    colors_pie = ['#ff9999', '#66b3ff', '#99ff99', '#ffcc99', '#ff99cc']
    ax3.pie(payment_counts, labels=payment_counts.index, autopct='%1.1f%%',
            colors=colors_pie, startangle=90, textprops={'fontsize': 12})
    ax3.set_title('Payment Method Distribution', fontweight='bold', fontsize=18)

    # Row 2: Driver & Customer Ratings, Incomplete Rides
    ax5 = fig.add_subplot(gs[2, 0])
    ax5.hist(df['Driver Ratings (1-5 scale)'].dropna(), bins=25, color='lightgreen',
             edgecolor='black', alpha=0.7)
    ax5.axvline(df['Driver Ratings (1-5 scale)'].mean(), color='red', linestyle='--',
                linewidth=3, label=f'Mean: {df["Driver Ratings (1-5 scale)"].mean():.2f}')
    ax5.set_title('Driver Ratings Distribution', fontweight='bold', fontsize=18)
    ax5.set_xlabel('Rating', fontsize=14)
    ax5.set_ylabel('Frequency', fontsize=14)
    ax5.legend(fontsize=12)
    ax5.grid(True, alpha=0.3)
    ax5.tick_params(labelsize=12)

    ax6 = fig.add_subplot(gs[2, 1])
    ax6.hist(df['Customer Rating (1-5 scale)'].dropna(), bins=25, color='#FFD700',
             edgecolor='black', alpha=0.7)
    ax6.axvline(df['Customer Rating (1-5 scale)'].mean(), color='red', linestyle='--',
                linewidth=3, label=f'Mean: {df["Customer Rating (1-5 scale)"].mean():.2f}')
    ax6.set_title('Customer Rating Distribution', fontweight='bold', fontsize=18)
    ax6.set_xlabel('Rating', fontsize=14)
    ax6.set_ylabel('Frequency', fontsize=14)
    ax6.legend(fontsize=12)
    ax6.grid(True, alpha=0.3)
    ax6.tick_params(labelsize=12)

    ax13 = fig.add_subplot(gs[2, 2])
    incomplete_data = df['Incomplete Rides'].value_counts()
    colors_incomplete = ['#90EE90', '#FF6347']
    ax13.pie(incomplete_data, labels=incomplete_data.index, autopct='%1.1f%%',
            colors=colors_incomplete, startangle=90, textprops={'fontsize': 12})
    ax13.set_title('Incomplete Rides', fontweight='bold', fontsize=18)

    # Row 3: Booking Value vs Distance (Full Width)
    ax7 = fig.add_subplot(gs[3, :])
    scatter = ax7.scatter(df['Ride Distance (in km)'], df['Booking Value (in INR)'],
                         alpha=0.4, c=df['Ride Distance (in km)'], cmap='viridis', s=20)
    ax7.set_title('Booking Value vs Ride Distance', fontweight='bold', fontsize=18)
    ax7.set_xlabel('Ride Distance (km)', fontsize=14)
    ax7.set_ylabel('Booking Value (INR)', fontsize=14)
    ax7.grid(True, alpha=0.3)
    ax7.tick_params(labelsize=12)
    plt.colorbar(scatter, ax=ax7, label='Distance (km)')

    # Row 4: Hourly Bookings (Full Width)
    ax8 = fig.add_subplot(gs[4, :])
    df_time = df.copy()
    df_time['Booking Time'] = pd.to_datetime(df_time['Date'] + ' ' + df_time['Time'])
    df_time['Hour'] = df_time['Booking Time'].dt.hour
    hourly_bookings = df_time['Hour'].value_counts().sort_index()
    ax8.plot(hourly_bookings.index, hourly_bookings.values, marker='o', color='teal',
             linewidth=3, markersize=10, markerfacecolor='orange')
    ax8.fill_between(hourly_bookings.index, hourly_bookings.values, alpha=0.3, color='teal')
    ax8.set_title('Bookings by Hour of Day', fontweight='bold', fontsize=18)
    ax8.set_xlabel('Hour', fontsize=14)
    ax8.set_ylabel('Number of Bookings', fontsize=14)
    ax8.grid(True, alpha=0.3)
    ax8.tick_params(labelsize=12)
    ax8.set_xticks(range(0, 24))

    # Row 5: Distance Distribution (Full Width)
    ax9 = fig.add_subplot(gs[5, :])
    ax9.hist(df['Ride Distance (in km)'], bins=50, color='coral', edgecolor='black', alpha=0.7)
    ax9.axvline(df['Ride Distance (in km)'].mean(), color='red', linestyle='--',
                linewidth=3, label=f'Mean: {df["Ride Distance (in km)"].mean():.2f} km')
    ax9.axvline(df['Ride Distance (in km)'].median(), color='blue', linestyle='--',
                linewidth=3, label=f'Median: {df["Ride Distance (in km)"].median():.2f} km')
    ax9.set_title('Ride Distance Distribution', fontweight='bold', fontsize=18)
    ax9.set_xlabel('Distance (km)', fontsize=14)
    ax9.set_ylabel('Frequency', fontsize=14)
    ax9.legend(fontsize=12)
    ax9.grid(True, alpha=0.3)
    ax9.tick_params(labelsize=12)

    # Row 6: Booking Value Distribution (Full Width)
    ax12 = fig.add_subplot(gs[6, :])
    ax12.hist(df['Booking Value (in INR)'], bins=50, color='#95E1D3', edgecolor='black', alpha=0.7)
    ax12.axvline(df['Booking Value (in INR)'].mean(), color='red', linestyle='--',
                linewidth=3, label=f'Mean: {df["Booking Value (in INR)"].mean():.0f} INR')
    ax12.axvline(df['Booking Value (in INR)'].median(), color='blue', linestyle='--',
                linewidth=3, label=f'Median: {df["Booking Value (in INR)"].median():.0f} INR')
    ax12.set_title('Booking Value Distribution', fontweight='bold', fontsize=18)
    ax12.set_xlabel('Booking Value (INR)', fontsize=14)
    ax12.set_ylabel('Frequency', fontsize=14)
    ax12.legend(fontsize=12)
    ax12.grid(True, alpha=0.3)
    ax12.tick_params(labelsize=12)

    # Row 7: Top Pickup & Drop Locations, Vehicle Details
    ax10 = fig.add_subplot(gs[7, 0])
    top_pickup = df['Pickup Location'].value_counts().head(15)
    ax10.barh(range(len(top_pickup)), top_pickup.values, color='#FF6B6B')
    ax10.set_yticks(range(len(top_pickup)))
    ax10.set_yticklabels(top_pickup.index, fontsize=10)
    ax10.set_title('Top 15 Pickup Locations', fontweight='bold', fontsize=18)
    ax10.set_xlabel('Count', fontsize=14)
    ax10.tick_params(labelsize=12)
    ax10.invert_yaxis()

    ax11 = fig.add_subplot(gs[7, 1])
    top_drop = df['Drop Location'].value_counts().head(15)
    ax11.barh(range(len(top_drop)), top_drop.values, color='#4ECDC4')
    ax11.set_yticks(range(len(top_drop)))
    ax11.set_yticklabels(top_drop.index, fontsize=10)
    ax11.set_title('Top 15 Drop Locations', fontweight='bold', fontsize=18)
    ax11.set_xlabel('Count', fontsize=14)
    ax11.tick_params(labelsize=12)
    ax11.invert_yaxis()

    ax14 = fig.add_subplot(gs[7, 2])
    top_vehicles = df['Vehicle Type'].value_counts().head(15)
    ax14.barh(range(len(top_vehicles)), top_vehicles.values, color='orange')
    ax14.set_yticks(range(len(top_vehicles)))
    ax14.set_yticklabels(top_vehicles.index, fontsize=10)
    ax14.set_title('Top 15 Vehicle Types', fontweight='bold', fontsize=18)
    ax14.set_xlabel('Count', fontsize=14)
    ax14.tick_params(labelsize=12)
    ax14.invert_yaxis()

    # 대시보드를 고해상도 PNG로 저장
    plt.savefig('gaeun/result/comprehensive_dashboard.png', dpi=150, bbox_inches='tight')
    print("✓ Dashboard 생성 완료")
    print("  → 파일 저장: comprehensive_dashboard.png (이미지 뷰어에서 스크롤하며 확인 가능)")

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

    # 모든 그래프를 한 번에 표시
    plt.show()
