import pandas as pd
import warnings
warnings.filterwarnings('ignore')


# Pre-Processing & Task 1

month_map = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December',
}

df = pd.read_excel('daily_temp_salorono.xlsx')[:-1]

# cast date into real datetime object
df['date'] = df['date'].apply(
    lambda x: pd.to_datetime(x.replace('.', '-'), dayfirst=True))

# filter keeping only required year
year_list = [2021, 2017, 2013, 2009, 2005, 2001, 1997, 1993]
df['year'] = df['date'].apply(lambda x: x.year)
df['month'] = df['date'].apply(lambda x: x.month)
df = df[df['year'].isin(year_list)]

# clean non numeric data in "sum", "min", "max"
df['min'] = df['min'].apply(lambda x: float(x) if type(
    x) == int else 0.0 if x == '---' else float(x))
df['max'] = df['max'].apply(lambda x: float(x) if type(
    x) == int else 0.0 if x == '---' else float(x))

grouped = df[['year', 'month', 'min']].groupby(by=['year', 'month']).min()
grouped['max'] = df[['year', 'month', 'max']].groupby(
    by=['year', 'month']).min()['max']
grouped['mean'] = round((grouped['max'] + grouped['min']) / 2, 2)

grouped = grouped.reset_index(drop=False)
grouped['month'] = grouped['month'].apply(lambda x: month_map[x])

grouped.to_csv('grouped_cleaned_daily_temp_data.csv', index=False)

df['mean'] = round((df['min'] + df['max']) / 2, 2)
# renaming columns
df = df[['date', 'mean', 'min', 'max']]

# save into csv
df.to_csv('cleaned_daily_temp_data.csv', index=False)

# Task 3

df['month'] = df['date'].apply(lambda x: x.month)
df['year'] = df['date'].apply(lambda x: x.year)
df['day'] = df['date'].apply(lambda x: x.day)

# for year in df['year'].unique():

#     df_year = df[df['year'] == year]
#     df_year = df_year[['mean', 'month', 'day']]

#     pivot = pd.pivot_table(df_year, index='day', columns='month',
#                            values='mean', aggfunc=sum).fillna(0).astype(float).reset_index()

#     pivot = pivot.set_index('day').rename(columns={
#         1: 'January',
#         2: 'February',
#         3: 'March',
#         4: 'April',
#         5: 'May',
#         6: 'June',
#         7: 'July',
#         8: 'August',
#         9: 'September',
#         10: 'October',
#         11: 'November',
#         12: 'December',
#     })

#     pivot.to_csv(f'pivot_data_year_{year}.csv', index=False)

for year in df['year'].unique():

    df_year = df[df['year'] == year]
    df_year = df_year[['max', 'month', 'day']]

    pivot = pd.pivot_table(df_year, index='day', columns='month',
                        values='max', aggfunc=sum).fillna(0).astype(float).reset_index()

    pivot = pivot.set_index('day').rename(columns={
        1: 'January',
        2: 'February',
        3: 'March',
        4: 'April',
        5: 'May',
        6: 'June',
        7: 'July',
        8: 'August',
        9: 'September',
        10: 'October',
        11: 'November',
        12: 'December',
    })

    pivot.to_csv(f'pivot_data_max_year_{year}.csv', index=False)


for year in df['year'].unique():

    df_year = df[df['year'] == year]
    df_year = df_year[['min', 'month', 'day']]

    pivot = pd.pivot_table(df_year, index='day', columns='month',
                        values='min', aggfunc=sum).fillna(0).astype(float).reset_index()

    pivot = pivot.set_index('day').rename(columns={
        1: 'January',
        2: 'February',
        3: 'March',
        4: 'April',
        5: 'May',
        6: 'June',
        7: 'July',
        8: 'August',
        9: 'September',
        10: 'October',
        11: 'November',
        12: 'December',
    })

    pivot.to_csv(f'pivot_data_min_year_{year}.csv', index=False)