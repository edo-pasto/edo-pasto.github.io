import geopandas as gpd
gpd.read_file('../data/geo_data_trees.geojson').to_csv('../data/geo_data_trees.csv')