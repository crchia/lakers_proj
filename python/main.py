import pandas as pd

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

keep_cols_posts = ['SeasonType',
                    'direct',
                    'endLocX',
                    'endLocY',
                    'locationX',
                    'locationY',
                    'ptsScored',
                    'region']

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
