from application.static.python.Airports import *

#Global objects
graph = make_airports_graph()
vertexes_and_edges = vertexes_edgelist(graph)
airports = Graph(vertexes_and_edges[0], vertexes_and_edges[1])

#minimun spanning tree using Kruskal's Algorithm
def kruskal_mst() -> dict[str, list[tuple[str, float]]]:
    return airports.KruskalMST()

#minimun spanning tree using Prim's Algorithm
def prim_mst(start_vertex: str) -> dict[str, list[tuple[str, float]]]:
    return airports.Prim(graph, start_vertex)
