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
with open('../data/circoscrizioni.json', 'r') as neighborhoods:
    nbhs = json.load(neighborhoods)

    for nbh in nbhs['features']:
        nbhs_map[nbh['properties']['nome']] = Polygon(nbh['geometry']['coordinates'][0])

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
pivot_data = pivot_data[['Neighborhood'] + top_X_trees + ['Other']]
# save into csv
pivot_data.to_csv('../data/top_trees_neighborhood.csv', index=False)

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
    unpivot_data[unpivot_data['Neighborhood'] == nbh].to_csv(f'../data/single_neighborhoods/top_trees_{nbh}.csv', index=False)