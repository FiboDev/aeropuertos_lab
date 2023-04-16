# Folium
import folium
# from folium.plugins import MousePosition
# Pandas
import pandas as pd

# Map config.
m = folium.Map( # Colombia location
                #         LAT   LON
                location=[4.74, -71],

                # Bounds
                zoom_start=6,
                min_zoom = 6,
                max_bounds=True,

                # Dragging region
                min_lat=-6,
                max_lat=20,
                min_lon=-100,
                max_lon=-40,

                # Map style
                tiles='cartodb positron'
                
                )


# CSV airport data
df = pd.read_csv("server/application/static/airports.csv", sep = ',')

# Markers
for index, row in df.iterrows():
    # Airport coordinates
    marker_LAT = row['latitude_deg']
    marker_LON = row['longitude_deg']

    # Airport data
    airport_name = row['nombre_con_tilde']
    airport_location = row['municipality']

    #Popup data
    popup_data = f'''
        <p><b>Aeropuerto:</b> {airport_name}</p>
        <p><b>Ubicación:</b> {airport_location}</p> 
    '''

    # Marker data
    marker = folium.Marker(
        location=[marker_LAT, marker_LON],
        popup=popup_data,
        icon=folium.Icon(color="gray", icon="plane"),
        name=airport_name
    )

    marker.add_to(m)


# Coordinates
# MousePosition(
#      position="topright",
#      separator=" | ",
#      empty_string="NaN",
#      lng_first=True,
#      num_digits=20,
#      prefix="Coordinates:"
# ).add_to(m)

# Map save
m.save("server/application/static/index.html")