# gaeunLeeDetailVisual.py
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from scipy import stats
from scipy.stats import f_oneway, chi2_contingency

# Style settings
sns.set_style("whitegrid")

# Load CSV file
print("Loading data...")
try:
    df=pd.read_csv('booking_data_converted.csv')
    print(f"Total records: {len(df):,}\n")
except FileNotFoundError:
    print("Error: booking_data_converted.csv 파일을 찾을 수 없습니다. \
          CSV 파일이 존재하는지 확인해주세요.")
    exit(1)

# ============================================
# 1. Data Preprocessing & Feature Engineering
# ============================================

print("=" * 80)
print("1. Data Preprocessing & Feature Engineering")
print("=" * 80)

# 1-1. Time period categorization
def categorize_time(hour):
    if 0 <= hour < 6:
        return 'Early Morning (00-06)'
    elif 6 <= hour < 9:
        return 'Morning (06-09)'
    elif 9 <= hour < 12:
        return 'Late Morning (09-12)'
    elif 12 <= hour < 18:
        return 'Afternoon (12-18)'
    elif 18 <= hour < 22:
        return 'Evening (18-22)'
    else:
        return 'Night (22-24)'

# Create time features
df['Booking Time'] = pd.to_datetime(df['Date'] + ' ' + df['Time'])
df['Hour'] = df['Booking Time'].dt.hour
df['Time_Category'] = df['Hour'].apply(categorize_time)
print("✓ Time categorization completed")

# 1-2. Distance categorization
def categorize_distance(distance):
    if pd.isna(distance):
        return 'Unknown'
    elif distance < 5:
        return 'Short (0-5km)'
    elif distance < 20:
        return 'Medium (5-20km)'
    elif distance < 30:
        return 'Long (20-30km)'
    else:
        return 'Very Long (30km+)'

df['Distance_Category'] = df['Ride Distance (in km)'].apply(categorize_distance)
print("✓ Distance categorization completed")

# 1-3. Booking status categorization
def categorize_booking_status(status):
    if status == 'Completed':
        return 'Completed'
    elif status == 'Cancelled by Customer':
        return 'Cancelled (Customer)'
    elif status == 'Cancelled by Driver':
        return 'Cancelled (Driver)'
    elif status == 'Incomplete':
        return 'Incomplete'
    elif status == 'No Driver Found':
        return 'No Driver'
    else:
        return 'Other'

df['Status_Category'] = df['Booking Status'].apply(categorize_booking_status)
print("✓ Status categorization completed\n")

# Data summary
print("Feature Statistics:")
print(f"  Time categories: {df['Time_Category'].unique()}")
print(f"  Distance categories: {df['Distance_Category'].unique()}")
print(f"  Status categories: {df['Status_Category'].unique()}")
print()

# ============================================
# Hypothesis 1: Time vs Status Cross-Analysis
# ============================================

def hypothesis1_time_status_distribution():
    print("\n" + "=" * 80)
    print("Hypothesis 1: Time Period vs Booking Status Distribution (Cross-Analysis)")
    print("=" * 80)

    # Create crosstab
    crosstab = pd.crosstab(df['Time_Category'], df['Status_Category'])
    print("\n[Crosstab - Counts]")
    print(crosstab)

    # Percentage crosstab
    crosstab_pct = pd.crosstab(df['Time_Category'], df['Status_Category'], normalize='index') * 100
    print("\n[Crosstab - Percentages]")
    print(crosstab_pct.round(2))

    # Chi-square test
    chi2, p_value, dof, expected = chi2_contingency(crosstab)
    print(f"\n[Chi-square Test Results]")
    print(f"Chi-square statistic: {chi2:.4f}")
    print(f"P-value: {p_value:.6f}")
    print(f"Degrees of freedom: {dof}")

    if p_value < 0.05:
        print("Conclusion: Significant relationship between time and booking status (p < 0.05)")
    else:
        print("Conclusion: No significant relationship between time and booking status (p >= 0.05)")

# ============================================
# Hypothesis 2: Night/Late Night Incomplete Rate
# ============================================

def hypothesis2_night_incomplete_rate():
    print("\n" + "=" * 80)
    print("Hypothesis 2: Night/Late Night Incomplete Rate Analysis")
    print("=" * 80)

    # Define night periods
    df['Is_Night'] = df['Time_Category'].isin(['Early Morning (00-06)', 'Night (22-24)'])

    # Calculate incomplete rates
    incomplete_by_time = df.groupby('Is_Night')['Status_Category'].apply(
        lambda x: (x == 'Incomplete').sum() / len(x) * 100
    )

    print("\n[Incomplete Rate Comparison]")
    print(f"Daytime incomplete rate: {incomplete_by_time[False]:.2f}%")
    print(f"Night/Late night incomplete rate: {incomplete_by_time[True]:.2f}%")
    print(f"Difference: {incomplete_by_time[True] - incomplete_by_time[False]:.2f}%p")

    # Detailed by time category
    time_order = ['Early Morning (00-06)', 'Morning (06-09)', 'Late Morning (09-12)',
                  'Afternoon (12-18)', 'Evening (18-22)', 'Night (22-24)']
    incomplete_by_category = df.groupby('Time_Category')['Status_Category'].apply(
        lambda x: (x == 'Incomplete').sum() / len(x) * 100
    ).reindex(time_order)

    print("\n[Incomplete Rate by Time Period]")
    for time_cat, rate in incomplete_by_category.items():
        print(f"  {time_cat}: {rate:.2f}%")

    # Chi-square test (night vs day)
    contingency = pd.crosstab(df['Is_Night'], df['Status_Category'] == 'Incomplete')
    chi2, p_value, dof, expected = chi2_contingency(contingency)

    print(f"\n[Chi-square Test (Night vs Day)]")
    print(f"Chi-square statistic: {chi2:.4f}")
    print(f"P-value: {p_value:.6f}")

    if p_value < 0.05:
        print("Conclusion: Significant difference in incomplete rates (p < 0.05)")
    else:
        print("Conclusion: No significant difference in incomplete rates (p >= 0.05)")

# ============================================
# Hypothesis 3: Commute Time VTAT Analysis
# ============================================

def hypothesis3_commute_vtat():
    print("\n" + "=" * 80)
    print("Hypothesis 3: Commute Time VTAT Average Comparison (ANOVA)")
    print("=" * 80)

    # Define commute periods
    df['Commute_Category'] = 'Regular Hours'
    df.loc[df['Time_Category'] == 'Morning (06-09)', 'Commute_Category'] = 'Morning Commute'
    df.loc[df['Time_Category'] == 'Evening (18-22)', 'Commute_Category'] = 'Evening Commute'

    # Calculate VTAT statistics
    vtat_by_commute = df.groupby('Commute_Category')['Avg VTAT (in minutes)'].agg(['mean', 'std', 'count'])
    print("\n[VTAT Statistics by Commute Period]")
    print(vtat_by_commute.round(2))

    # ANOVA test
    groups = []
    for category in df['Commute_Category'].unique():
        data = df[df['Commute_Category'] == category]['Avg VTAT (in minutes)'].dropna()
        groups.append(data)

    f_stat, p_value = f_oneway(*groups)

    print(f"\n[ANOVA Test Results]")
    print(f"F-statistic: {f_stat:.4f}")
    print(f"P-value: {p_value:.6f}")

    if p_value < 0.05:
        print("Conclusion: Significant difference in VTAT across commute periods (p < 0.05)")
    else:
        print("Conclusion: No significant difference in VTAT across commute periods (p >= 0.05)")

# ============================================
# Hypothesis 4: Evening Cancellation Analysis
# ============================================

def hypothesis4_evening_cancellation():
    print("\n" + "=" * 80)
    print("Hypothesis 4: Evening Customer Cancellation Rate Analysis")
    print("=" * 80)

    # Calculate cancellation rates
    time_order = ['Early Morning (00-06)', 'Morning (06-09)', 'Late Morning (09-12)',
                  'Afternoon (12-18)', 'Evening (18-22)', 'Night (22-24)']
    cancellation_by_time = df.groupby('Time_Category')['Status_Category'].apply(
        lambda x: (x == 'Cancelled (Customer)').sum() / len(x) * 100
    ).reindex(time_order)

    print("\n[Customer Cancellation Rate by Time Period]")
    for time_cat, rate in cancellation_by_time.items():
        print(f"  {time_cat}: {rate:.2f}%")

    evening_rate = cancellation_by_time['Evening (18-22)']
    other_avg = cancellation_by_time.drop('Evening (18-22)').mean()

    print(f"\nEvening cancellation rate: {evening_rate:.2f}%")
    print(f"Other periods average: {other_avg:.2f}%")
    print(f"Difference: {evening_rate - other_avg:.2f}%p")

    # Chi-square test (evening vs others)
    df['Is_Evening'] = df['Time_Category'] == 'Evening (18-22)'
    contingency = pd.crosstab(df['Is_Evening'], df['Status_Category'] == 'Cancelled (Customer)')
    chi2, p_value, dof, expected = chi2_contingency(contingency)

    print(f"\n[Chi-square Test (Evening vs Others)]")
    print(f"Chi-square statistic: {chi2:.4f}")
    print(f"P-value: {p_value:.6f}")

    if p_value < 0.05:
        print("Conclusion: Significant difference in evening cancellation rate (p < 0.05)")
    else:
        print("Conclusion: No significant difference in evening cancellation rate (p >= 0.05)")

    # Cancellation reasons
    evening_reasons = df[(df['Time_Category'] == 'Evening (18-22)') &
                         (df['Status_Category'] == 'Cancelled (Customer)')]['Reason for cancelling by Customer'].value_counts()

    print("\n[Top 5 Evening Cancellation Reasons]")
    if len(evening_reasons) > 0:
        for i, (reason, count) in enumerate(evening_reasons.head(5).items(), 1):
            print(f"  {i}. {reason}: {count} cases")
    else:
        print("  No cancellation reason data available")

# ============================================
# Comprehensive Dashboard
# ============================================

def create_comprehensive_dashboard():
    print("\n" + "=" * 80)
    print("Creating Comprehensive Dashboard")
    print("=" * 80)

    fig = plt.figure(figsize=(24, 38))
    gs = fig.add_gridspec(7, 3, hspace=0.6, wspace=0.4)

    # Title
    ax_title = fig.add_subplot(gs[0, :])
    ax_title.axis('off')
    title_text = f"""
    ══════════════════════════════════════════════════════════════════════════════════════════════════════════
                                    GAEUN LEE - Time-Based Hypothesis Testing Dashboard
    ══════════════════════════════════════════════════════════════════════════════════════════════════════════

    Total Records: {len(df):,}  |  Analysis Period: {df['Date'].min()} ~ {df['Date'].max()}
    """
    ax_title.text(0.5, 0.5, title_text, fontsize=13, verticalalignment='center', horizontalalignment='center',
                 family='monospace', bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.3))

    # Row 1: Hypothesis 1 - Time vs Status (Stacked Bar)
    ax1 = fig.add_subplot(gs[1, :])
    time_order = ['Early Morning (00-06)', 'Morning (06-09)', 'Late Morning (09-12)',
                  'Afternoon (12-18)', 'Evening (18-22)', 'Night (22-24)']
    crosstab = pd.crosstab(df['Time_Category'], df['Status_Category']).reindex(time_order)
    crosstab.plot(kind='bar', stacked=True, ax=ax1, colormap='Set3', edgecolor='black')
    ax1.set_title('[Hypothesis 1] Booking Status Distribution by Time Period', fontsize=18, fontweight='bold')
    ax1.set_xlabel('Time Period', fontsize=14)
    ax1.set_ylabel('Count', fontsize=14)
    ax1.legend(title='Status', bbox_to_anchor=(1.01, 1), loc='upper left', fontsize=11)
    ax1.tick_params(axis='x', rotation=45)

    # Row 2: Status Rate Heatmap (Full Width)
    ax2 = fig.add_subplot(gs[2, :])
    crosstab_pct = pd.crosstab(df['Time_Category'], df['Status_Category'], normalize='index').reindex(time_order) * 100
    sns.heatmap(crosstab_pct, annot=True, fmt='.1f', cmap='Blues', ax=ax2, cbar_kws={'label': 'Percentage (%)'})
    ax2.set_title('[Hypothesis 1] Status Rate by Time Period (%)', fontsize=18, fontweight='bold')
    ax2.set_xlabel('Booking Status', fontsize=14)
    ax2.set_ylabel('Time Period', fontsize=14)
    ax2.tick_params(axis='x', rotation=45)

    # Row 3: Hypothesis 2 - Night Incomplete Rate
    ax3 = fig.add_subplot(gs[3, 0])
    df['Is_Night'] = df['Time_Category'].isin(['Early Morning (00-06)', 'Night (22-24)'])
    incomplete_by_time = df.groupby('Is_Night')['Status_Category'].apply(
        lambda x: (x == 'Incomplete').sum() / len(x) * 100
    )
    categories = ['Daytime', 'Night/Late Night']
    rates = [incomplete_by_time[False], incomplete_by_time[True]]
    bars = ax3.bar(categories, rates, color=['skyblue', 'darkblue'], edgecolor='black', linewidth=2)
    ax3.set_title('[Hypothesis 2] Night Incomplete Rate', fontsize=16, fontweight='bold')
    ax3.set_ylabel('Incomplete Rate (%)', fontsize=12)
    for bar, rate in zip(bars, rates):
        ax3.text(bar.get_x() + bar.get_width()/2., bar.get_height(),
                f'{rate:.2f}%', ha='center', va='bottom', fontsize=12, fontweight='bold')

    ax4 = fig.add_subplot(gs[3, 1])
    incomplete_by_category = df.groupby('Time_Category')['Status_Category'].apply(
        lambda x: (x == 'Incomplete').sum() / len(x) * 100
    ).reindex(time_order)
    colors_time = ['#2C3E50' if 'Night' in t or 'Early Morning' in t else '#3498DB' for t in time_order]
    ax4.bar(range(len(time_order)), incomplete_by_category, color=colors_time, edgecolor='black')
    ax4.set_xticks(range(len(time_order)))
    ax4.set_xticklabels(time_order, rotation=45, ha='right', fontsize=10)
    ax4.set_title('Incomplete Rate by Time', fontsize=16, fontweight='bold')
    ax4.set_ylabel('Rate (%)', fontsize=12)

    ax5 = fig.add_subplot(gs[3, 2])
    night_incomplete = df[(df['Is_Night']) & (df['Status_Category'] == 'Incomplete')].shape[0]
    day_incomplete = df[(~df['Is_Night']) & (df['Status_Category'] == 'Incomplete')].shape[0]
    ax5.pie([day_incomplete, night_incomplete], labels=[f'Daytime\n{day_incomplete}', f'Night\n{night_incomplete}'],
            colors=['#3498DB', '#2C3E50'], autopct='%1.1f%%', explode=(0, 0.1), startangle=90)
    ax5.set_title('Incomplete Distribution', fontsize=16, fontweight='bold')

    # Row 4: Hypothesis 3 - Commute VTAT
    ax6 = fig.add_subplot(gs[4, :2])
    df['Commute_Category'] = 'Regular Hours'
    df.loc[df['Time_Category'] == 'Morning (06-09)', 'Commute_Category'] = 'Morning Commute'
    df.loc[df['Time_Category'] == 'Evening (18-22)', 'Commute_Category'] = 'Evening Commute'
    commute_order = ['Morning Commute', 'Evening Commute', 'Regular Hours']
    df_plot = df[df['Avg VTAT (in minutes)'].notna()]
    sns.boxplot(x='Commute_Category', y='Avg VTAT (in minutes)', data=df_plot,
                order=commute_order, palette='Set2', ax=ax6, hue='Commute_Category', legend=False)
    ax6.set_title('[Hypothesis 3] VTAT Distribution by Commute Period', fontsize=18, fontweight='bold')
    ax6.set_xlabel('Period', fontsize=14)
    ax6.set_ylabel('VTAT (minutes)', fontsize=14)

    ax7 = fig.add_subplot(gs[4, 2])
    vtat_by_commute = df.groupby('Commute_Category')['Avg VTAT (in minutes)'].mean().reindex(commute_order)
    colors_bar = ['#FF6B6B', '#4ECDC4', '#95E1D3']
    bars = ax7.bar(range(len(commute_order)), vtat_by_commute, color=colors_bar, edgecolor='black', linewidth=2)
    ax7.set_xticks(range(len(commute_order)))
    ax7.set_xticklabels(['Morning', 'Evening', 'Regular'], fontsize=11)
    ax7.set_title('Average VTAT Comparison', fontsize=16, fontweight='bold')
    ax7.set_ylabel('Avg VTAT (min)', fontsize=12)
    for bar, mean in zip(bars, vtat_by_commute):
        ax7.text(bar.get_x() + bar.get_width()/2., bar.get_height(),
                f'{mean:.2f}', ha='center', va='bottom', fontsize=11, fontweight='bold')

    # Row 5: Hypothesis 4 - Evening Cancellation
    ax8 = fig.add_subplot(gs[5, 0])
    cancellation_by_time = df.groupby('Time_Category')['Status_Category'].apply(
        lambda x: (x == 'Cancelled (Customer)').sum() / len(x) * 100
    ).reindex(time_order)
    colors_cancel = ['red' if t == 'Evening (18-22)' else 'lightblue' for t in time_order]
    ax8.bar(range(len(time_order)), cancellation_by_time, color=colors_cancel, edgecolor='black')
    ax8.set_xticks(range(len(time_order)))
    ax8.set_xticklabels(time_order, rotation=45, ha='right', fontsize=10)
    ax8.set_title('[Hypothesis 4] Customer Cancellation Rate', fontsize=16, fontweight='bold')
    ax8.set_ylabel('Rate (%)', fontsize=12)

    ax9 = fig.add_subplot(gs[5, 1])
    evening_rate = cancellation_by_time['Evening (18-22)']
    other_avg = cancellation_by_time.drop('Evening (18-22)').mean()
    bars = ax9.bar(['Other Periods', 'Evening (18-22)'], [other_avg, evening_rate],
                   color=['lightblue', 'red'], edgecolor='black', linewidth=2)
    ax9.set_title('Evening vs Other Periods', fontsize=16, fontweight='bold')
    ax9.set_ylabel('Cancellation Rate (%)', fontsize=12)
    for bar, rate in zip(bars, [other_avg, evening_rate]):
        ax9.text(bar.get_x() + bar.get_width()/2., bar.get_height(),
                f'{rate:.2f}%', ha='center', va='bottom', fontsize=12, fontweight='bold')

    ax10 = fig.add_subplot(gs[5, 2])
    cancel_counts = df[df['Status_Category'] == 'Cancelled (Customer)']['Time_Category'].value_counts().reindex(time_order)
    ax10.bar(range(len(time_order)), cancel_counts, color='salmon', edgecolor='black')
    ax10.set_xticks(range(len(time_order)))
    ax10.set_xticklabels(time_order, rotation=45, ha='right', fontsize=10)
    ax10.set_title('Customer Cancellation Count', fontsize=16, fontweight='bold')
    ax10.set_ylabel('Count', fontsize=12)

    # Row 6: Additional Insights
    ax11 = fig.add_subplot(gs[6, 0])
    distance_counts = df['Distance_Category'].value_counts()
    distance_order = ['Short (0-5km)', 'Medium (5-20km)', 'Long (20-30km)', 'Very Long (30km+)']
    distance_counts_ordered = distance_counts.reindex(distance_order).dropna()
    ax11.pie(distance_counts_ordered, labels=distance_counts_ordered.index, autopct='%1.1f%%',
            colors=sns.color_palette('pastel'), startangle=90)
    ax11.set_title('Distance Distribution', fontsize=16, fontweight='bold')

    ax12 = fig.add_subplot(gs[6, 1])
    status_counts = df['Status_Category'].value_counts()
    ax12.barh(range(len(status_counts)), status_counts.values, color='lightgreen', edgecolor='black')
    ax12.set_yticks(range(len(status_counts)))
    ax12.set_yticklabels(status_counts.index, fontsize=11)
    ax12.set_title('Booking Status Distribution', fontsize=16, fontweight='bold')
    ax12.set_xlabel('Count', fontsize=12)
    ax12.invert_yaxis()

    ax13 = fig.add_subplot(gs[6, 2])
    hourly_bookings = df['Hour'].value_counts().sort_index()
    ax13.plot(hourly_bookings.index, hourly_bookings.values, marker='o', color='teal',
             linewidth=2, markersize=8, markerfacecolor='orange')
    ax13.fill_between(hourly_bookings.index, hourly_bookings.values, alpha=0.3, color='teal')
    ax13.set_title('Hourly Booking Distribution', fontsize=16, fontweight='bold')
    ax13.set_xlabel('Hour', fontsize=12)
    ax13.set_ylabel('Count', fontsize=12)
    ax13.grid(True, alpha=0.3)
    ax13.set_xticks(range(0, 24, 2))

    #After
    plt.savefig('gaeun/result/comprehensive_hypothesis_dashboard.png', dpi=150, bbox_inches='tight')
    print("\n✓ Dashboard saved: comprehensive_hypothesis_dashboard.png")

# ============================================
# Main Execution
# ============================================

if __name__ == "__main__":
    print("\n" + "="*80)
    print("GAEUN LEE - Time-Based Hypothesis Testing Analysis")
    print("="*80 + "\n")

    # Run hypothesis tests
    hypothesis1_time_status_distribution()
    hypothesis2_night_incomplete_rate()
    hypothesis3_commute_vtat()
    hypothesis4_evening_cancellation()

    # Create comprehensive dashboard
    create_comprehensive_dashboard()

    print("\n" + "="*80)
    print("Analysis Complete!")
    print("="*80)
    print("\nGenerated file:")
    print("  - comprehensive_hypothesis_dashboard.png")
    print("\nOpen the file to view all results!")
