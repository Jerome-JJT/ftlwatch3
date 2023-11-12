import os
import sys
import random
import json
import datetime

from _dbConnector import *
from _utils_map import *

import math
import gravis as gv
import networkx as nx


    
def generate_love(graph_type="", output_name='', min_date='2000-00-00', max_date='2099-99-99', is_piscine=None, dist=90, nbrank=6):
    
    graph_generator = []
    if (graph_type == "multi"):
        graph_generator = nx.MultiDiGraph()
    
    else:
        graph_generator = nx.Graph()


    raw_links = executeQuerySelect("""
        SELECT * FROM (

            SELECT user1_id, u1.login AS user1_login, u2.login AS user2_login, user2_id,
                SUM(length) AS length, ROW_NUMBER() OVER (PARTITION BY user1_id ORDER BY SUM(length) DESC) AS ranked
            FROM (
                SELECT user1_id AS user1_id, user2_id AS user2_id, date, dist, length, is_piscine FROM vp_loves
                UNION 
                SELECT user1_id AS user2_id, user2_id AS user1_id, date, dist, length, is_piscine FROM vp_loves
            ) sub_uall

            JOIN users u1 ON u1.id = sub_uall.user1_id
            JOIN users u2 ON u2.id = sub_uall.user2_id
            
            WHERE date between %(min_date)s AND %(max_date)s
            AND (%(is_piscine)s IS NULL OR is_piscine = %(is_piscine)s)
            AND dist < %(dist)s
            AND u1.hidden = False AND u1.login NOT LIKE '3b3-%%' AND u1.has_cursus21 = True AND (u1.blackhole > NOW() OR u1.grade = 'Member')
            AND u2.hidden = False AND u2.login NOT LIKE '3b3-%%' AND u2.has_cursus21 = True AND (u2.blackhole > NOW() OR u2.grade = 'Member')


            GROUP BY user1_id, user1_login, user2_id, user2_login
        ) uall

        WHERE ranked <= %(rank)s

    """, {
        "min_date": min_date,
        "max_date": max_date,
        "is_piscine": is_piscine,
        "dist": dist,
        "rank": nbrank,
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
        AND hidden = False AND login NOT LIKE '3b3-%%' AND has_cursus21 = True AND (blackhole > NOW() OR grade = 'Member')
        GROUP BY user_id, user_login, user_image
    """, {
        "min_date": min_date,
        "max_date": max_date,
        "is_piscine": is_piscine,
        "dist": dist,
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

            nodes[rnode["user_id"]] = {'login': rnode["user_login"], 'size': max(1, rnode["length"]), 'color': color, 'image': rnode["user_image"]}

            sizes.append(rnode["length"])

    if (len(sizes) == 0):
        print("Stop: No size")
        return 

    sizes.sort()

    hexasize = sizes[int(len(sizes) * 0.94)]
    squaresize = sizes[int(len(sizes) * 0.7)]

    max_length = 0

    for rlinks in raw_links:

        if (math.sqrt(rlinks["length"]) > max_length):
            max_length = math.sqrt(rlinks["length"])

    length_ratio = 10 / max_length


    for node in nodes.values():

        if (node['size'] <= 0):
            continue
        
        try:
            img = gv.convert.image_to_data_url(node['image'], 'svg')
        except:
            img = ''

        shape = 'circle'

        if node['size'] > hexasize:
            shape = 'hexagon'
        elif node['size'] > squaresize:
            shape = 'rectangle'
        

        truesize = int(mathmap(math.sqrt(node['size']), math.sqrt(sizes[0]), math.sqrt(sizes[-1]), 10, 60))

        if img != '':
            graph_generator.add_node(node['login'], size=truesize, shape=shape, image=img)
        else:
            graph_generator.add_node(node['login'], size=truesize, shape=shape)



    for link in raw_links:
        truelength = mathmap(math.sqrt(link["length"]), 0, max_length, 0.0, 10.0)

        if (link["user1_login"] != link["user2_login"] and (truelength > 0.6 or link['ranked'] <= 3)):

            graph_generator.add_edge(link["user1_login"], link["user2_login"], 
                                 size=max(1, int(round(truelength, 0))), 
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


    with open(f'/secure_static/{output_name}.html', 'w') as f:
        f.write(fig.to_html_standalone())




if __name__ == "__main__":

    target_date = datetime.datetime(datetime.datetime.now().year, 10, 1)
    target_date = target_date.strftime("%Y-%m-%d")

    generate_love(output_name='love_piscine_2d', is_piscine=True)
    generate_love(output_name='love_all_2d')
    generate_love(output_name='love_recent_2d', is_piscine=False, min_date=target_date)

    generate_love(graph_type="3d", output_name='love_piscine_3d', is_piscine=True)
    generate_love(graph_type="3d", output_name='love_all_3d')
    generate_love(graph_type="3d", output_name='love_recent_3d', is_piscine=False, min_date=target_date)

