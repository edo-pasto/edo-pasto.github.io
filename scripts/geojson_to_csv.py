import json
import pandas as pd
import geopandas as gpd

from shapely.geometry import Point
from shapely.geometry.polygon import Polygon

DATA_PATH = '../data'

# load and convert geojson data into dataframe
df = gpd.read_file(f'{DATA_PATH}/geo_data_trees.geojson')#.to_csv(f'{DATA_PATH}/geo_data_trees.csv')

# Task 1
'''
bar chart showing top X (ex: top 10) trees type, their numbers and the average canopy size
'''
top = 20

canopy_cover = df[['Name', 'Canopy Cover (m2)']][:-1] # remove the last line because is the total
canopy_cover['Canopy Cover (m2)'] = canopy_cover['Canopy Cover (m2)'].apply(float) # cast string to float values

# count the occurences of every tree
top_trees = canopy_cover.groupby('Name').count().round(2).rename(columns={'Canopy Cover (m2)': 'Count'}).reset_index()
# compute the mean of the canopy cover for each tree
top_trees['Mean Canopy Cover (m2)'] = canopy_cover.groupby('Name').mean().round(2).values

# select only the top X and save into csv
top_trees = top_trees.sort_values(by='Count', ascending=False)[:top]
top_trees.to_csv(f'{DATA_PATH}/top_{top}_trees.csv', index=False)

# Task 2-4
'''
stacked bar chart comparing neighborhoods and tree types (top 5 + others)
'''
top = 5

# load "circoscrizioni" file (neighborhoods) and create a map
nbhs_map = {}
nbhs_map2 = {}
with open('../data/circoscrizioni.json', 'r') as neighborhoods:
    nbhs = json.load(neighborhoods)

    for nbh in nbhs['features']:
        nbhs_map[nbh['properties']['nome']] = Polygon(nbh['geometry']['coordinates'][0])
    
    for nbh in nbhs['features']:
        nbhs_map2[nbh['properties']['nome']] = nbh['properties']['area']


# define a function to retrieve for a given point the name of the neighborhood
def point_to_neighborhood(point):
    for nbh_name, nbh_points in nbhs_map.items():
        if nbh_points.contains(point): return nbh_name

data = df[['Longitude', 'Latitude', 'Name']][:-1] # remove the last line because is the total

# retrieve the neighborhood from the longitude and latitude
for nbh_name, nbh_points in nbhs_map.items():
    data['Neighborhood'] = data.apply(lambda x: point_to_neighborhood(Point(x.Longitude, x.Latitude)), axis=1)

data = data[['Name', 'Neighborhood']]

# keep only the top X trees generalizing the others
all_trees = df['Name'].unique()
top_X_trees = list(top_trees[:top]['Name'])
other_trees = list(set(all_trees) - set(top_X_trees))

data['Name'] = data['Name'].map({tree :(tree if tree in top_X_trees else 'Other') for tree in all_trees})
data['Count'] = 1

# pivot the dataframe and fill the holes
pivot_data = pd.pivot_table(data, index='Neighborhood', columns='Name', values='Count', aggfunc=sum).fillna(0).astype(int).reset_index()

# order columns following the order of the top X trees (just because my brain wants to see them ordered)
pivot_data = pivot_data[['Neighborhood'] + top_X_trees + ['Other']].sort_values(by='Other', ascending=False)

# (for stacked bar chart) order data according to the "Other" percentage
pivot_data_stacked = pivot_data.copy()
pivot_data_stacked['Other_perc'] = pivot_data_stacked['Other'] / pivot_data_stacked[top_X_trees + ['Other']].sum(axis=1)
pivot_data_stacked = pivot_data_stacked.sort_values(by='Other_perc').drop(columns='Other_perc')

# save into csv
pivot_data.to_csv('../data/top_trees_neighborhood.csv', index=False)
pivot_data_stacked.to_csv('../data/top_trees_neighborhood_stacked.csv', index=False)

# Task 3
'''
bar chart as the stacked ones (comparing neighborhoods and tree types) but using the small multiples
'''
unpivot_data = data.groupby(by=['Neighborhood', 'Name']).sum().reset_index()
unpivot_data.to_csv('../data/top_trees_neighborhood_unpivot.csv', index=False)

# Task 5
'''
waffle chart (showing the percentage of each tree)
data are separated for each neighborhood
'''
for nbh in data['Neighborhood'].unique():
    unpivot_data[unpivot_data['Neighborhood'] == nbh].sort_values(by='Count', ascending=False).to_csv(f'../data/single_neighborhood/top_trees_{nbh}.csv', index=False)


#-------------------------------------------------
#                   ASSIGNMENT 2 
#-------------------------------------------------

#Task1
measure = df[['Height (m)', 'Crown Height (m)', 'Crown Width (m)', 'Canopy Cover (m2)']][:-1]
measure['Height (m)'] = measure['Height (m)'].apply(float) 
measure['Crown Height (m)'] = measure['Crown Height (m)'].apply(float) 
measure['Crown Width (m)'] = measure['Crown Width (m)'].apply(float) 
measure['Canopy Cover (m2)'] = measure['Canopy Cover (m2)'].apply(float) 

measure.to_csv(f'{DATA_PATH}/treesMeasures.csv', index=False)

#Task2
top = 6

measure = df[['Name','Height (m)', 'Crown Height (m)', 'Crown Width (m)', 'Canopy Cover (m2)']][:-1]
measure['Height (m)'] = measure['Height (m)'].apply(float) 
measure['Crown Height (m)'] = measure['Crown Height (m)'].apply(float) 
measure['Crown Width (m)'] = measure['Crown Width (m)'].apply(float) 
measure['Canopy Cover (m2)'] = measure['Canopy Cover (m2)'].apply(float) 

trees_occurences = df[['Name', 'DBH (cm)']]
top_trees = trees_occurences.groupby('Name').count().round(2).rename(columns={'DBH (cm)': 'Count'}).reset_index()
top_trees = top_trees.sort_values(by='Count', ascending=False)[:top]
trees_name = top_trees['Name'].tolist()

result = measure[measure.Name.isin(trees_name)]
result = result.sort_values(by='Name')
result = result.sample(frac=0.3)
result.to_csv(f'{DATA_PATH}/top_{top}_treesMeasures.csv', index=False)

#TASK 3
data_task3 = df[['Name','Height (m)', 'Crown Width (m)', 'Canopy Cover (m2)', 'Crown Height (m)', 'Gross Carbon Sequestration (kg/yr)', 'Gross Carbon Sequestration (eur/yr)']][:-1]
data_task3['Height (m)'] = data_task3['Height (m)'].apply(float)
data_task3['Crown Width (m)'] = data_task3['Crown Width (m)'].apply(float)
data_task3['Canopy Cover (m2)'] = data_task3['Canopy Cover (m2)'].apply(float)
data_task3['Crown Height (m)'] = data_task3['Crown Height (m)'].apply(float)
# data_task3['Oxygen Production (kg/yr)'] = data_task3['Oxygen Production (kg/yr)'].apply(float)
data_task3['Gross Carbon Sequestration (kg/yr)'] = data_task3['Gross Carbon Sequestration (kg/yr)'].apply(float)
data_task3['Gross Carbon Sequestration (eur/yr)'] = data_task3['Gross Carbon Sequestration (eur/yr)'].apply(float)


top = 6
trees_occurences = df[['Name', 'DBH (cm)']]
top_trees = trees_occurences.groupby('Name').count().round(2).rename(columns={'DBH (cm)': 'Count'}).reset_index()
top_trees = top_trees.sort_values(by='Count', ascending=False)[:top]
trees_name = top_trees['Name'].tolist()

result = data_task3[data_task3.Name.isin(trees_name)]
result = result.sort_values(by='Name')
result = result.sample(frac=0.5)
result.to_csv(f'{DATA_PATH}/top_{top}_treesMeasuresScatter.csv', index=False)



#Task 4
data_task4 = df[['Name','Height (m)', 'Crown Width (m)', 'Canopy Cover (m2)', 'Crown Height (m)', 'Gross Carbon Sequestration (kg/yr)', 'Gross Carbon Sequestration (eur/yr)']][:-1]

data_task4['Height (m)'] = data_task4['Height (m)'].apply(float)
data_task4['Crown Width (m)'] = data_task4['Crown Width (m)'].apply(float)
data_task4['Canopy Cover (m2)'] = data_task4['Canopy Cover (m2)'].apply(float)
data_task4['Crown Height (m)'] = data_task4['Crown Height (m)'].apply(float)
data_task4['Gross Carbon Sequestration (kg/yr)'] = data_task4['Gross Carbon Sequestration (kg/yr)'].apply(float)
data_task4['Gross Carbon Sequestration (eur/yr)'] = data_task4['Gross Carbon Sequestration (eur/yr)'].apply(float)

trees_occurences = df[['Name', 'DBH (cm)']]
top_trees = trees_occurences.groupby('Name').count().round(2).rename(columns={'DBH (cm)': 'Count'}).reset_index()
top_trees = top_trees.sort_values(by='Count', ascending=False)[:top]
trees_name = top_trees['Name'].tolist()

result = data_task4[data_task4.Name.isin(trees_name)]
result = result.sort_values(by='Name')
# result = result.sample(frac=0.3)
result.to_csv(f'{DATA_PATH}/top_{top}_treesMeasuresSmallMulti.csv', index=False)


#TASK 5
# data_task3 = df[['Name','Height (m)', 'Crown Width (m)', 'Canopy Cover (m2)', 'Crown Height (m)', 'Oxygen Production (kg/yr)']][:-1]
data_task5 = df[['Name','Height (m)', 'Crown Width (m)', 'Canopy Cover (m2)', 'Crown Height (m)', 'Gross Carbon Sequestration (kg/yr)']][:-1]

data_task5['Height (m)'] = data_task5['Height (m)'].apply(float)
data_task5['Crown Width (m)'] = data_task5['Crown Width (m)'].apply(float)
data_task5['Canopy Cover (m2)'] = data_task5['Canopy Cover (m2)'].apply(float)
data_task5['Crown Height (m)'] = data_task5['Crown Height (m)'].apply(float)
# data_task3['Oxygen Production (kg/yr)'] = data_task3['Oxygen Production (kg/yr)'].apply(float)
data_task5['Gross Carbon Sequestration (kg/yr)'] = data_task5['Gross Carbon Sequestration (kg/yr)'].apply(float)

top = 6
# #Keep only the tope 5 trees
trees_occurences = df[['Name', 'DBH (cm)']]
top_trees = trees_occurences.groupby('Name').count().round(2).rename(columns={'DBH (cm)': 'Count'}).reset_index()
top_trees = top_trees.sort_values(by='Count', ascending=False)[:top]
trees_name = top_trees['Name'].tolist()

result = data_task5[data_task5.Name.isin(trees_name)]
result = result.sort_values(by='Name')
result = result.sample(frac=0.3)
result.to_csv(f'{DATA_PATH}/top_{top}_treesMeasuresBubble.csv', index=False)


#-------------------------------------------------
#                   ASSIGNMENT 3 
#-------------------------------------------------
#Task 1
result_task1Ass3 = unpivot_data.groupby(by=['Neighborhood'])['Count'].sum().reset_index()
neigh = result_task1Ass3['Neighborhood']
count = result_task1Ass3['Count']
zipped = list(zip(neigh, count))
result1 = pd.DataFrame(zipped, columns=['Neighborhood','Count'])
result1.to_csv(f'{DATA_PATH}/neighborhoodAbundance.csv', index=False)

#Task2
task2 = pd.read_csv('../data/top_trees_neighborhood_unpivot_task_5_A_2.csv')
gruopByNeigh = task2.groupby(by=['Neighborhood'])['Canopy Cover (m2)'].sum().reset_index()
count = gruopByNeigh['Canopy Cover (m2)']
zipped = list(zip(neigh, count))
canopy_cover_perNeigh = pd.DataFrame(zipped, columns=['Neighborhood','Canopy Cover (m2)'])
print(canopy_cover_perNeigh)

area_perNeigh = pd.DataFrame(columns=['Neighborhood', 'Area'])
keys = nbhs_map2.keys()
values = nbhs_map2.values()
area_perNeigh['Neighborhood'] = keys
area_perNeigh['Area'] = values
area_perNeighSorted = area_perNeigh.sort_values(by='Neighborhood').reset_index()
# df2['Country'] = df2['id'].map(df1.drop_duplicates().set_index('iso')['Country'])
# print(count)
area_perNeighSorted['Canopy Cover (m2)'] = count
print(area_perNeighSorted)
areas = area_perNeighSorted['Area']
canopyAreas = area_perNeighSorted['Canopy Cover (m2)']
density = []
for a, c in zip(areas, canopyAreas):
    density.append((c/a))
area_perNeighSorted['Density'] = density
print(area_perNeighSorted)

area_perNeighSorted.to_csv(f'{DATA_PATH}/neighborhoodDensity.csv', index=False)


#Task3
task3 = pd.read_csv('../data/top_trees_neighborhood_unpivot_task_5_A_2.csv')
result_task3Ass3 = task3.groupby(by=['Neighborhood'])['Oxygen Production (kg/yr)'].sum().reset_index()
count = result_task3Ass3['Oxygen Production (kg/yr)']
zipped = list(zip(neigh, count))
result3 = pd.DataFrame(zipped, columns=['Neighborhood','Oxygen Production (kg/yr)'])
result3.to_csv(f'{DATA_PATH}/neighborhoodOxygenProd.csv', index=False)

#Task5

top = 10

canopy_cover = df[['Name', 'Canopy Cover (m2)', 'Latitude', 'Longitude']][:-1] # remove the last line because is the total
canopy_cover['Canopy Cover (m2)'] = canopy_cover['Canopy Cover (m2)'].apply(float) # cast string to float values

# count the occurences of every tree
top_trees = canopy_cover.groupby('Name').count().round(2).rename(columns={'Canopy Cover (m2)': 'Count'}).reset_index()
# select only the top X and save into csv
top_trees = top_trees.sort_values(by='Count', ascending=False)[:top]
top_trees.to_csv(f'{DATA_PATH}/MapTop_{top}_trees.csv', index=False)
