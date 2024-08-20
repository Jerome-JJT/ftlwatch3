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


    
def generate_fall(graph_type="", output_name='', min_date='2000-00-00', max_date='2099-99-99', is_piscine=None, takes=['T', 'S'], nboccure=3):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR
    
    mylogger(f"Fall {output_name}, start generation", LOGGER_INFO)

    graph_generator = []
    graph_generator = nx.MultiDiGraph()
    # if (graph_type == "multi"):
    
    # else:
    #     graph_generator = nx.Graph()

    
    raw_links = executeQuerySelect("""
        SELECT evaluator.login AS evaluated_login, corrector.login AS corrector_login, COUNT(*) AS occure
        FROM team_scale

        JOIN teams ON teams.id = team_scale.team_id
        JOIN team_user ON team_user.team_id = teams.id
        JOIN projects ON projects.id = teams.project_id

        JOIN users evaluator ON evaluator.id = team_user.user_id
        JOIN users corrector ON corrector.id = team_scale.corrector_id       

        WHERE projects.main_cursus = 21 AND corrector_id IS NOT NULL AND projects.project_type_id = 1
                                   
        GROUP BY evaluator.login, corrector.login
        HAVING COUNT(*) >= %(minoccure)s
    """, {
        "minoccure": nboccure,
    })

    raw_nodes = executeQuerySelect("""
        SELECT users.id AS user_id, users.login AS user_login, users.avatar_url AS user_image,
                (CASE WHEN users.has_cursus21 = FALSE THEN 'N' ELSE CASE WHEN users.end_at IS NOT NULL THEN 'B' ELSE CASE WHEN users.grade = 'Member' THEN 'T' ELSE 'S' END END END) AS user_type
            FROM users
            
        WHERE users.hidden = False AND users.kind <> 'external' AND users.login NOT LIKE '3b3-%%' AND users.has_cursus21 = True
    """, {})

    mylogger(f"Fall {output_name}, start node treatment", LOGGER_INFO)

    nodes = {}

    for rnode in raw_nodes:

        if (rnode["user_login"] not in nodes.keys() and rnode["user_type"] in takes):

            pseudoseed = 0
            for let in rnode["user_login"]:
                pseudoseed *= 26
                pseudoseed += ord(let) - 64
            random.seed(pseudoseed)
            link_color = '#%02X%02X%02X' % (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))

            # if (rnode["user_type"] == "B"):
            #     node_color = '#B22222'
            # elif (rnode["user_type"] == "T"):
            #     node_color = '#32CD32'
            # elif (rnode["user_type"] == "N"):
            #     node_color = '#800080'
            # else:
            node_color = '#008080'

            nodes[rnode["user_login"]] = {'login': rnode["user_login"], 'size': 0, 'node_color': node_color, 'link_color': link_color, 'image': rnode["user_image"]}

            


    mylogger(f"Fall {output_name}, start links treatment", LOGGER_INFO)

    for rlink in raw_links:

        if (rlink['corrector_login'] in nodes.keys() and rlink['evaluated_login'] in nodes.keys()):
            nodes[rlink['corrector_login']]['size'] = max(20 + rlink['occure'] * 4, nodes[rlink['corrector_login']]['size'] + rlink['occure'] * 4)
            nodes[rlink['evaluated_login']]['size'] = max(20, nodes[rlink['evaluated_login']]['size'])
        

    sizes = []
    for node in nodes.values():
        sizes.append(node["size"])

    if (len(sizes) == 0):
        print("Stop: No size")
        return 

    sizes.sort()
    max_occure = sizes[-1]


    hexasize = sizes[int(len(sizes) * 0.94)]
    squaresize = sizes[int(len(sizes) * 0.7)]


    mylogger(f"Fall {output_name}, start node creation", LOGGER_INFO)

    for node in nodes.values():

        if (node['size'] <= 0):
            continue
        
        try:
            img = gv.convert.image_to_data_url(node['image'], 'jpg')
        except:
            img = ''

        shape = 'circle'

        if node['size'] > hexasize:
            shape = 'hexagon'
        elif node['size'] > squaresize:
            shape = 'rectangle'
        

        truesize = int(mathmap(math.sqrt(node['size']), math.sqrt(sizes[0]), math.sqrt(sizes[-1]), 10, 60))

        if img != '':
            graph_generator.add_node(node['login'], size=truesize, shape=shape, color=node['node_color'], image=img)
        else:
            graph_generator.add_node(node['login'], size=truesize, shape=shape, color=node['node_color'])


    mylogger(f"Fall {output_name}, start link creation", LOGGER_INFO)

    for link in raw_links:
        try:
            if (link["corrector_login"] != link["evaluated_login"]):

                graph_generator.add_edge(link["corrector_login"], link["evaluated_login"], 
                                    size=max(1, link["occure"]), 
                                    color=nodes[link["corrector_login"]]['link_color'])
        except:
            pass


    mylogger(f"Fall {output_name}, start output", LOGGER_INFO)


    links_force_distance=50.0
    links_force_strength=0.2
    collision_force_strength=1.0
    collision_force_radius=100.0


    fig = gv.d3(graph_generator, 
                graph_height=1000, 
                many_body_force_strength=-360, 
                edge_curvature=0.4,
                links_force_distance=links_force_distance,
                links_force_strength=links_force_strength,
                use_collision_force=True, 
                collision_force_radius=collision_force_radius,
                collision_force_strength=collision_force_strength,
                zoom_factor=0.5
            )


    with open(f'/secure_static/{output_name}.html', 'w') as f:
        f.write(fig.to_html_standalone())

    mylogger(f"Fall {output_name}, end generation", LOGGER_INFO)
    


def gen_falls():
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR, LOGGER_ALERT
    mylogger("Start fall graph generator", LOGGER_ALERT)

    try:

        # target_date = datetime.datetime(datetime.datetime.now().year - 1, 10, 1)
        # target_date = target_date.strftime("%Y-%m-%d")

        generate_fall(output_name='fall_all', takes=['T', 'S', 'B'], nboccure=4)

        mylogger("End fall graph generator", LOGGER_ALERT)

    except Exception as e:
        mylogger(f"Generate fall error, {type(e)}, {e}", LOGGER_ERROR)


if __name__ == "__main__":
    gen_falls()

