import os
from collections import OrderedDict

import shopify
from fulfil_client import Client

# Setup shopify to access the supplier's inventory.
# The shop name can be found from the admin url used for logging in
# This assumes the use of a private app
# See: https://help.shopify.com/manual/apps/private-apps#generate-credentials-from-the-shopify-admin
shop_url = "https://%s:%s@%s.myshopify.com/admin" % (
  os.environ['SHOPIFY_API_KEY'],
  os.environ['SHOPIFY_PASSWORD'],
  os.environ['SHOP_NAME'],
)
shopify.ShopifyResource.set_site(shop_url)

# Setup a connection to Fulfil
fulfil = Client(
  os.environ['FULFIL_SUBDOMAIN'],
  os.environ['FULFIL_API_KEY'],
)
ProductSupplier = fulfil.model('purchase.product_supplier')

supplier_code = os.environ['SUPPLIER_CODE']


def fetch_inventory_and_update():
    all_supplied_items = ProductSupplier.search_read_all(
        # The search filter
        [
            ('party.code', '=', supplier_code)
        ],
        None,   # Sort Order
        ['id', 'code', 'quantity_available']
    )

    # Make a lookup dictionary for easy access
    supplier_items = {}
    for item in all_supplied_items:
        if not item['code']:
            # Skip if there is no supplier sku
            continue
        supplier_items[item['code'].upper()] = item

    print("Found %d items in fulfil by supplier" % len(supplier_items))
    # A dictionary to store changes for a bulk update later.
    supplier_items_to_update = OrderedDict()

    # Get all products from the shopify store
    for product in shopify.Product.find():
        # browse through each variant
        for variant in product.variants:
            sku = variant.sku.upper()
            if sku not in supplier_items:
                continue
            item = supplier_items[sku]
            if item['quantity_available'] != variant.inventory_quantity:
                supplier_items_to_update[item['id']] = variant.inventory_quantity

    # Now check if any inventory changes are there to update
    if not supplier_items_to_update:
        print("No inventory changes to update fulfil with")
        return

    print("Updating %d supplier items" % len(supplier_items_to_update))
    # Call fulfil's bulk update api
    bulk_update_args = []
    for supplier_item_id, available_qty in supplier_items_to_update.items():
        bulk_update_args.append([supplier_item_id])
        bulk_update_args.append({
            'quantity_available': available_qty,
        })
    ProductSupplier.write(*bulk_update_args)


if __name__ == '__main__':
    fetch_inventory_and_update()import os
from collections import OrderedDict

import shopify
from fulfil_client import Client

# Setup shopify to access the supplier's inventory.
# The shop name can be found from the admin url used for logging in
# This assumes the use of a private app
# See: https://help.shopify.com/manual/apps/private-apps#generate-credentials-from-the-shopify-admin
shop_url = "https://%s:%s@%s.myshopify.com/admin" % (
  os.environ['SHOPIFY_API_KEY'],
  os.environ['SHOPIFY_PASSWORD'],
  os.environ['SHOP_NAME'],
)
shopify.ShopifyResource.set_site(shop_url)

# Setup a connection to Fulfil
fulfil = Client(
  os.environ['FULFIL_SUBDOMAIN'],
  os.environ['FULFIL_API_KEY'],
)
ProductSupplier = fulfil.model('purchase.product_supplier')

supplier_code = os.environ['SUPPLIER_CODE']


def fetch_inventory_and_update():
    all_supplied_items = ProductSupplier.search_read_all(
        # The search filter
        [
            ('party.code', '=', supplier_code)
        ],
        None,   # Sort Order
        ['id', 'code', 'quantity_available']
    )

    # Make a lookup dictionary for easy access
    supplier_items = {}
    for item in all_supplied_items:
        if not item['code']:
            # Skip if there is no supplier sku
            continue
        supplier_items[item['code'].upper()] = item

    print("Found %d items in fulfil by supplier" % len(supplier_items))
    # A dictionary to store changes for a bulk update later.
    supplier_items_to_update = OrderedDict()

    # Get all products from the shopify store
    for product in shopify.Product.find():
        # browse through each variant
        for variant in product.variants:
            sku = variant.sku.upper()
            if sku not in supplier_items:
                continue
            item = supplier_items[sku]
            if item['quantity_available'] != variant.inventory_quantity:
                supplier_items_to_update[item['id']] = variant.inventory_quantity

    # Now check if any inventory changes are there to update
    if not supplier_items_to_update:
        print("No inventory changes to update fulfil with")
        return

    print("Updating %d supplier items" % len(supplier_items_to_update))
    # Call fulfil's bulk update api
    bulk_update_args = []
    for supplier_item_id, available_qty in supplier_items_to_update.items():
        bulk_update_args.append([supplier_item_id])
        bulk_update_args.append({
            'quantity_available': available_qty,
        })
    ProductSupplier.write(*bulk_update_args)


if __name__ == '__main__':
    fetch_inventory_and_update()