import warnings
warnings.filterwarnings('ignore')

import pandas as pd

df = pd.read_excel('daily_temp_salorono.xlsx')[:-1]

# cast date into real datetime object
df['date'] = df['date'].apply(lambda x: pd.to_datetime(x.replace('.','-'), dayfirst=True))

# filter keeping only from 2015 until now
df = df[df['date'] >= '2015-01-01']

# clean non numeric data in "sum", "min", "max"
df['sum'] = df['sum'].apply(lambda x: float(x) if type(x)==int else 0.0 if x=='---' else float(x))
df['min'] = df['min'].apply(lambda x: float(x) if type(x)==int else 0.0 if x=='---' else float(x))
df['max'] = df['max'].apply(lambda x: float(x) if type(x)==int else 0.0 if x=='---' else float(x))

# renaming columns
df = df.rename(columns={'sum': 'value'})

# save into csv
df.to_csv('cleaned_daily_temp_data.csv', index=False)