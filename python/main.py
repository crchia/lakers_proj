# This file reads in the given datasets from the xlsx sheet 
# using the pandas library and filters and transforms the data into 
# JSON format, which is outputted to the relative path '../src/all.json'.
# This JSON data is used by the React frontend to build the visualizations.

import pandas as pd

# columns of interest for drive data
keep_cols_drives = ['SeasonType', 
             'direct', 
             'endLocX',
             'endLocY',
             'locationX',
             'locationY',
             'ptsScored',
             'category',
             'direction',
             'region']

# columns of interest for post up data
keep_cols_posts = ['SeasonType',
                    'direct',
                    'endLocX',
                    'endLocY',
                    'locationX',
                    'locationY',
                    'ptsScored',
                    'region']

# function I used to play around with different filters for drives
def drives_calc(drives):
  drives = drives[drives['direct']]
  right = drives[drives['direction'] == 'right']
  left = drives[drives['direction'] == 'left']
  pts_right = right['ptsScored'].sum()
  pts_left = left['ptsScored'].sum()
  print(len(left))
  print(len(right))
  print(pts_left / len(left))
  print(pts_right / len(right))
  
# function I used to play around with different filters for posts
def posts_calc(posts):
  posts = posts[posts['direct'] & (posts['SeasonType'] == 'playoff')]
  right = posts[posts['region'].str.contains('right')]
  left = posts[posts['region'].str.contains('left')]
  pts_right = right['ptsScored'].sum()
  pts_left = left['ptsScored'].sum()
  print(len(left))
  print(len(right))
  print(pts_left / len(left))
  print(pts_right / len(right))
  
# main function: reads in the data, performs filtering/transformation,
# and outputs to JSON format
def main():
  drives = pd.read_excel('data.xlsx', sheet_name=0, engine='openpyxl')
  drives = drives[keep_cols_drives]
  drives['type'] = 'drive'
  posts = pd.read_excel('data.xlsx', sheet_name=2, engine='openpyxl')
  posts = posts[keep_cols_posts]
  posts['type'] = 'post'
  all = drives.append(posts)
  direct = all[all['direct']]
  direct.to_json('../src/all.json', orient='records', indent=2)
  

if __name__ == '__main__':
  main()
