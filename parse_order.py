# Code by Zapier Python Script to process orders. Part 1 of 2.
output = []

items = input_data['items'].split('|')
# For each item in order, call Part 2 to process item
for item in items[:-1]:
    item = "{" + str(item) + "}"
    d = eval(item)
    output.append(d.copy())
    res = requests.post("https://hooks.zapier.com/hooks/catch/xxxxxx/xxxxxx/", params=d)
    res.raise_for_status()
