output = []

items = input_data['items'].split('|')
for item in items[:-1]:
    item = "{" + str(item) + "}"
    d = eval(item)
    output.append(d.copy())
    res = requests.post("https://hooks.zapier.com/hooks/catch/xxxxxx/xxxxxx/", params=d)
    res.raise_for_status()
