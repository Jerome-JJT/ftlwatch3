import os
import sys
import random
import json
import datetime

from _dbConnector import *


import math
import gravis as gv
import networkx as nx





    
def main(graph_type = ""):
    
    graph_generator = []
    if (graph_type == "multi"):
        graph_generator = nx.MultiDiGraph()
    
    else:
        graph_generator = nx.Graph()


    raw_links = executeQuerySelect("""
        SELECT * FROM (

            SELECT user1_id, users.login AS user1_login, user2_id,
                SUM(length) AS length, ROW_NUMBER() OVER (PARTITION BY user1_id ORDER BY SUM(length) DESC) AS ranked
            FROM (
                SELECT user1_id AS user1_id, user2_id AS user2_id, date, dist, length, is_piscine FROM vp_loves
                UNION 
                SELECT user1_id AS user2_id, user2_id AS user1_id, date, dist, length, is_piscine FROM vp_loves
            ) sub_uall

            JOIN users ON users.id = sub_uall.user1_id
            
            WHERE date between %(min_date)s AND %(max_date)s
            AND (%(is_piscine)s IS NULL OR is_piscine = %(is_piscine)s)
            AND dist < %(dist)s

            GROUP BY user1_id, user1_login, user2_id
        ) uall

        WHERE ranked <= %(rank)s

    """, {
        "min_date": '2000-00-00',
        "max_date": '2099-99-99',
        "is_piscine": None,
        "dist": 90,
        "rank": 10,
    })

    raw_nodes = executeQuerySelect("""
        SELECT user_id, users.login AS user_login, users.avatar_url AS user_image, SUM(length) AS length FROM (
            SELECT user1_id AS user_id, date, dist, length, is_piscine FROM vp_loves
            UNION 
            SELECT user2_id AS user_id, date, dist, length, is_piscine FROM vp_loves
        ) uall

        JOIN users ON users.id = uall.user_id
        
        WHERE date between %(min_date)s AND %(max_date)s
        AND (%(is_piscine)s IS NULL OR is_piscine = %(is_piscine)s)
        AND dist < %(dist)s
        GROUP BY user_id, user_login, user_image
    """, {
        "min_date": '2000-00-00',
        "max_date": '2099-99-99',
        "is_piscine": None,
        "dist": 90,
    })


    nodes = {}
    sizes = []

    for rnode in raw_nodes:

        if (rnode["user_id"] not in nodes.keys()):
            if (rnode["length"] <= 0):
                continue

            pseudoseed = 0
            for let in rnode["user_login"]:
                pseudoseed *= 26
                pseudoseed += ord(let) - 64
            random.seed(pseudoseed)
            color = '#%02X%02X%02X' % (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))

            nodes[rnode["user_id"]] = {'login': rnode["user_login"], 'size': max(1, math.sqrt(rnode["length"]) / 10000), 'color': color, 'image': rnode["user_image"]}

            sizes.append(rnode["length"])

    if (len(sizes) == 0):
        print("Stop: No size")
        exit()

    sizes.sort()

    hexasize = sizes[int(len(sizes) * 0.94)]
    squaresize = sizes[int(len(sizes) * 0.7)]

    max_length = 0

    for rlinks in raw_links:

        if (rlinks["length"] > max_length):
            max_length = rlinks["length"]

    length_ratio = 10 / max_length


    for key, node in nodes.items():
        
        try:
            img = gv.convert.image_to_data_url(node['image'], 'svg')
        except:
            img = ''

        shape = 'circle'

        if node['size'] > hexasize:
            shape = 'hexagon'
        elif node['size'] > squaresize:
            shape = 'rectangle'
        

        if img != '':
            graph_generator.add_node(key, size=max(10, int(float(node['size']) / 2.4)), shape=shape, image=img)
        else:
            graph_generator.add_node(key, size=max(10, int(float(node['size']) / 2.4)), shape=shape)



    for link in raw_links:
        if (link["user1_id"] in nodes.keys()):

            graph_generator.add_edge(link["user1_id"], link["user2_id"], 
                                 size=max(1, int(link["length"] * length_ratio)), 
                                 color=nodes[link["user1_id"]]['color'])


    if graph_type == "3d":
        fig = gv.three(graph_generator, 
                        graph_height=1000, 
                        many_body_force_strength=-360, 
                        edge_curvature=0.2,
                        zoom_factor=0.5
                    )
    
    else:
        fig = gv.d3(graph_generator, 
                    graph_height=1000, 
                    many_body_force_strength=-360, 
                    edge_curvature=0.2,
                    use_collision_force=True, 
                    collision_force_radius=60.0,
                    zoom_factor=0.5
                )





    # print(f'res_html/export_{dataset}_{graph}_{withmin}_{vers}.html')
    with open(f'/secure_static/test.html', 'w') as f:
        f.write(fig.to_html_standalone())







main()
# love_graph_mfunction(dataset="all", graph="simple", withmin="no", images=images)
# love_graph_mfunction(dataset="all", graph="multi", withmin="no", images=images)
# love_graph_mfunction(dataset="recent", graph="simple", withmin="yes", images=images)
# love_graph_mfunction(dataset="recent", graph="multi", withmin="yes", images=images)
# love_graph_mfunction(dataset="all", graph="simple", withmin="yes", images=images)

# love_graph_mfunction(dataset="all", graph="simple", withmin="no", vers="3d", images=images)
# love_graph_mfunction(dataset="all", graph="multi", withmin="no", vers="3d", images=images)
# love_graph_mfunction(dataset="recent", graph="simple", withmin="yes", vers="3d", images=images)
# love_graph_mfunction(dataset="recent", graph="multi", withmin="yes", vers="3d", images=images)
# love_graph_mfunction(dataset="all", graph="simple", withmin="yes", vers="3d", images=images)
