import pandas as pd
from vincenty import vincenty
from typing import List
from collections import defaultdict
import heapq

class Edge :

    def __init__(self, arg_src : str, arg_dst : str, arg_weight : int) :
        self.src = arg_src
        self.dst = arg_dst
        self.weight = arg_weight

class Graph :

    def __init__(self, vertices : List[str], edgelist : List[Edge]) :
        self.num_nodes = len(vertices)
        self.vertices = vertices
        self.edgelist  = edgelist
        self.parent    = {}
        self.rank      = {}
        # mst stores edges of the minimum spanning tree
        self.mst       = []

    def FindParent (self, node : str):
        # With path-compression.
        if node != self.parent[node] :
            self.parent[node] = self.FindParent(self.parent[node])
        return self.parent[node]
    
    #function to get the minimun spanning  tree using Kruskal's Algorithm
    def KruskalMST (self) -> dict[str, list[tuple[str, float]]]:

        # Sort objects of an Edge class based on attribute (weight)
        self.edgelist.sort(key = lambda Edge : Edge.weight)

        for vertex in self.vertices :
            self.parent[vertex] = vertex # Every vertex is the parent of itself at the beginning
            self.rank[vertex] = 0   # Rank of every vertex is 0 at the beginning

        lista = []
        for edge in self.edgelist :
            root1 = self.FindParent(edge.src)
            root2 = self.FindParent(edge.dst)

            # Vertices of the source and destination nodes are not in the same subset
            # Add the edge to the spanning tree
            if root1 != root2 :
                self.mst.append(edge)
                if self.rank[root1] < self.rank[root2] :
                    self.parent[root1] = root2
                    self.rank[root2] += 1
                else :
                    self.parent[root2] = root1
                    self.rank[root1] += 1

        #print("\nEdges of minimum spanning tree in graph :", end='')
        for edge in self.mst :
            lista.append({edge.src: (edge.dst, edge.weight)})        
        return lista
    
    #function to get the minimun spanning tree using Prim's Algorithm
    def Prim(self, graph, starting_vertex: str) -> dict[str, list[tuple[str, float]]]:
        mst = defaultdict(set)
        visited = set([starting_vertex])
        edges = [
            (cost, starting_vertex, to)
            for to, cost in graph[starting_vertex]
        ]

        heapq.heapify(edges)
        mst = []

        while edges:
            cost, frm, to = heapq.heappop(edges)
            
            if to not in visited:
                visited.add(to)
                mst.append({frm:(to, cost)})

                for to_next, cost in graph[to]:
                    if to_next not in visited:
                        heapq.heappush(edges, (cost, to, to_next))

        return mst

#function to create the complete airport graph
def make_airports_graph() -> dict[str, list[tuple[str, float]]]:
    
    # {name: (lat, long)}
    data = {fila[1].upper(): (fila[2], fila[3]) for fila in pd.read_csv("server/application/static/aeropuertos.csv").values}
    # {name: [(name, distance)]}
    airports_graph = {}
    for key in data:
        adjacent_airports = []
        for airport in data:
            if airport is not key:
                distance = vincenty(data[key], data[airport])
                adjacent_airports.append((airport,distance))
        airports_graph.update({key:adjacent_airports})

    return airports_graph

#function to create a vertex and edge lisr
def vertexes_edgelist(graph) -> tuple:
    
    #vertexes list
    vertexes = [key for key in graph]
    #edge list
    edgelist = []

    #create a Graph Object
    for key in graph:
        for tuples in graph[key]:
            edgelist.append(Edge(key, tuples[0], tuples[1]))

    return (vertexes, edgelist)