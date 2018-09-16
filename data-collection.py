from bs4 import BeautifulSoup
import urllib.request

def get_html_text(url):
    with urllib.request.urlopen("http://dining.rice.edu") as response:
        html = response.read()

    soup = BeautifulSoup(html, 'html.parser')
    return soup.prettify().replace("\n", "").replace("\t", "")

def find_string(text, string, start, stop=False):
    """
    looks over string text, and returns the indexes of all instances
    of string string within the text.
    """
    print("Start:", start)
    if stop == False:
        return find_string(text, string, start, len(text))
    found = []
    counter  = 0
    for char_idx in range(start, min(stop+len(string), len(text))):
        if text[char_idx] == string[counter]:
            counter += 1
            if counter == len(string):
                print(start)
                found.append(char_idx-len(string)+1)#+start)
                counter = 0
        else:
            coutner = 0

    return found

text = "aaaBakrBaeraaa"
print(find_string(text, "Baker", 0, 5))
##def find_all(string, text, start):
##    list_found = []
##    a = text.find(string, start)
##    if a == -1:
##        return [-1]
##    else:
##        list_found.append(find_all(string, text, a+1)+a+1)
##    list_found.append(a)
##    print(start, list_found)
##    return list_found

def collect_entries(text, servery):
    entries = ""
    start_place = text.find('<div class="servery-title" id="'+servery+'">', 0)
    print("start place:",start_place)
    stop_place = text.find('<div class="servery-title"', start_place+1)
    print("stop place:", stop_place)
    menu_indicator = '<div class="menu-item">'
    menu_starts = find_string(text, menu_indicator,
                                 start_place, stop_place)
    
    for idx in range(len(menu_starts)):
        menu_starts[idx] += len(menu_indicator)
    print(menu_starts)
    print(text[menu_starts[0]:menu_starts[0]+100])
    menu_stops = []
    menu_stop_indicator = "</div>"
    for start in menu_starts:
        menu_stops.append(text.find(menu_stop_indicator, start, stop_place))
    
    print(menu_stops)
    for item_idx in range(len(menu_starts)):
        print(menu_starts[item_idx], menu_stops[item_idx])
        entries+=(text[menu_starts[item_idx]:menu_stops[item_idx]].strip())
        entries+=", "
    print(entries)
    return servery, entries

url = "http://dining.rice.edu"
text = get_html_text(url)
print(collect_entries(text, "Seibel"))
#print(text)
print(text.find("""<div class="servery-title" id="Seibel">"""))
