from application.static.python.Airports import airports
import json

areopuertos = airports()
areopuertos.initialize_airports_list()

def addVertex(latitude: float, longitude: float):
    areopuertos.add_airport_vertex(latitude, longitude)

def removeVertex(latitude: float, longitude: float):
    areopuertos.remove_airport_vertex(latitude, longitude)

def addEdge(latOrigin: float, longOrigin: float, latDest: float, longDest: float):  
    return json.dumps(areopuertos.add_adjacency(latOrigin, longOrigin, latDest, longDest))

def removeEdge(latOrigin: float, longOrigin: float, latDest: float, longDest: float):
    areopuertos.remove_adjacency(latOrigin, longOrigin, latDest, longDest)

def DFS(latOrigin: float, longOrigin: float):
    #create a coordinate list
    coordinate_path = []
    #get the airport´s name
    airport_name = areopuertos.coordinatesToName(latOrigin, longOrigin)
    #return the DFS traversal
    traversal = areopuertos.DFSTraversal(airport_name)
    #iterate over the traversal
    for name in traversal:
        #append to the coordinate list the traversal´s names as coordinates
        coordinate_path.append(areopuertos.namesToCoordinates(name))
    #return a tuple
    return json.dumps(coordinate_path), json.dumps(traversal)

def BFS(latOrigin: float, longOrigin: float):
    #create a coordinate list
    coordinate_path = []
    #get the airport´s name
    airport_name = areopuertos.coordinatesToName(latOrigin, longOrigin)
    #return the BFS traversal
    traversal = areopuertos.BFSTraversal(airport_name)
    #iterate over the traversal
    for name in traversal:
        #append to the coordinate list the traversal´s names as coordinates
        coordinate_path.append(areopuertos.namesToCoordinates(name))
    #return a tuple
    return json.dumps(coordinate_path), json.dumps(traversal)

def shortestPathBetweenTwoDestinations(latOrigin: float, longOrigin: float, latDest: float, longDest: float):
    #calculate the shortest path
    path = areopuertos.floyd_warshall()
    #create a coordinate list
    coordinate_path = []
    #get the path
    name_paths = areopuertos.shortest_path_between_airports(latOrigin, longOrigin, latDest, longDest, path)
    #iterate over the path
    for name in name_paths:
        #append to the coordinate list the name_paths´s names as coordinates
        coordinate_path.append(areopuertos.namesToCoordinates(name))
    #return a tuple 
    return json.dumps(coordinate_path) , json.dumps(name_paths)

def shortestPathToAllDestinations(latOrigin: float, longOrigin: float):
    #calculate the shortest path
    path = areopuertos.floyd_warshall()
    #create a coordinate dictionary
    coordinate_path = {}
    #get the path
    paths = areopuertos.shortest_paths_to_airports(latOrigin, longOrigin, path)
    #iterate over the path
    for name in paths:
        #create a coordinate list
        coordinate_list = []
        #iterate over the path´s names
        for names in paths[name]:
            #append to the coordinate list the name_paths´s names as coordinates
            coordinate_list.append(areopuertos.namesToCoordinates(names))
        #append to the coordinate dictionary the name_paths´s names and the key itself as coordinates
        coordinate_path.update({str(areopuertos.namesToCoordinates(name)): coordinate_list})
    #return a tuple
    return json.dumps(coordinate_path), json.dumps(paths)
