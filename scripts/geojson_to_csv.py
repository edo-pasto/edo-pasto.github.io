import geopandas as gpd

DATA_PATH = '../data'

# load and convert geojson data into dataframe
df = gpd.read_file(f'{DATA_PATH}/geo_data_trees.geojson')#.to_csv(f'{DATA_PATH}/geo_data_trees.csv')

# Task 1
'''
bar chart showing top X (ex: top 10) trees type, their numbers and the average canopy size
'''
top = 10

canopy_cover = df[['Name', 'Canopy Cover (m2)']][:-1] # remove the last line because is the total
canopy_cover['Canopy Cover (m2)'] = canopy_cover['Canopy Cover (m2)'].apply(float) # cast string to float values

# count the occurences of every tree
top_trees = canopy_cover.groupby('Name').count().round(2).rename(columns={'Canopy Cover (m2)': 'Count'}).reset_index()
# compute the mean of the canopy cover for each tree
top_trees['Mean Canopy Cover (m2)'] = canopy_cover.groupby('Name').mean().round(2).values

# select only the top X and save into csv
top_trees = top_trees.sort_values(by='Count', ascending=False)[:top]
top_trees.to_csv(f'{DATA_PATH}/top_{top}_trees.csv', index=False)

