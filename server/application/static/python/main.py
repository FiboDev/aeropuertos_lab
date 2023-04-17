from application.static.python.Airports import *
import random

#Global objects
graph = make_airports_graph()
vertexes_and_edges = vertexes_edgelist(graph)
airports = Graph(vertexes_and_edges[0], vertexes_and_edges[1])

#minimun spanning tree using Kruskal's Algorithm
def kruskal_mst() -> dict[str, list[tuple[str, float]]]:
    airports.mst.clear()
    airports.rank.clear()
    airports.parent.clear()
    return airports.KruskalMST()

#minimun spanning tree using Prim's Algorithm
def prim_mst(start_vertex: str) -> dict[str, list[tuple[str, float]]]:

    if start_vertex == 'random':
        keys = [key for key in graph]
        key = keys[random.randint(0, 48)]
        start_vertex = key
    print(start_vertex)

    return airports.Prim(graph, start_vertex)
