## This repo holds my code for the SFCC Expert Learning Ticket

The cartridge where I am doing these implementations is called `sfcc_learning_path`.

---
### Create a Wishlist
##### As a registered and logged in customer
- [x] Add product to wishlist
    - [x] Store the wishlist items against the user account/email address
    - [x] Items are saved using the wishlist link
- [x] No permission to add product to wishlist if it already exists
    - [x] Display an error message
- [x] Remove  the item from my wishlist
    - [x] Remove from wishlist on the product details page
    - [x] Only show this button when the product **is** in the wishlist
- [x] Display an understandable message to inform the user that the item is in the wishlist
    - [x] When the product is **not** on the wishlist, display a message that invites the user to add it
    - [x] When the product **is** on the wishlist, display a message that invites the user to remove it
- [x] Separate page that show the user his products in the wishlist, this page exists in the My Account area
    - [x] From my account I am able to navigate to my wishlist
    - [x] Display my wishlist items
    - [x] Do not show the wishlist if logged out
- [x] Inside the wishlist page there must be an option to remove the items
    - [x] When the there are no products the wishlist shows as empty
- [x] Add products from wishlist to cart
    - [x] From the wishlist, each product has an option to add it to the cart
    - [x] Items remain on the wishlist when added to the cart
    - [x] Items that are added to the cart from the wishlist have their quantity updated appropriately
##### As a non-logged in customer
- [x] Displays the wishlist action disabled and a message that says the user needs to be logged in to do this.

---
### Products

- [x] Create a custom attribute to the product object that checks if a product can be added to the wishlist.

- [x] Add functionality that checks if this product can or cannot be added to the wishlist, display an appropriate message if false.