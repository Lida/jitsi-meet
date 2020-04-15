# Major concepts for board games
## Participants
**Participants** are all users that join a particular game room. 
* All participants will be able to participate in the group chat and video chat stream.

**Player** are participants that are playing an active role in the game being played.
* Players are allowed to perform actions on the board using the mouse and any associated UI.
* Players also have player zones that only they can see. This typically is a set of cards called a hand in game.
* All participants will be able to see actions taken on the board

Players are grouped into **Teams** which could be just one player or all the players for a co-op game.
* There is a team based communication channel for chat and video chat.
* Any player can initiate team chat by pressing space, which will blank out the video screen for the entire team while activated and prevent other team or spectators from seeing the stream.

Participants not playing the game are called **Spectators**.
* Spectators will not be able to see any player zone info, nor be in team communications.
* They won't be able to affect the board in anyway.

## Game
The game on the platform should all be physically based. i.e. people can play it using physical pieces and enforce rules manually without having to program in specific conditions. Actions that players can do should mirror physical actions and to make it easy to do so using the UI.

Most games have a few components in common.

**Board** is an area that can have pieces placed on top. It can be composed of different map **Tiles** to create a **Map**. Additional pieces may be placed on the Map which could be enemy tokens, terrain features, etc, but there isn't a need for them to be modelled specifically at this point. There is one main board that all participants can see and there can be player boards and team boards that are only visible to specific players.

**Piece** is a general term for anything that can be placed on the Map. The visual repsentation of the piece is important and should be specified.
* type // specify the type of the piece
    * image - uses an image to visually distinguish from other pieces
    * shape - a geometric shape 
    * dial - something that can be rotated
    * timer - 
* image properties
    * front - name of front image
    * back - name of the back image, if not specified, then the front is mirrored on the back
    * orientation
        * flat - a flat image token, which is placed flat on the map
        * standee - a image token that is placed on a stand.
    * stand color - color of the stand if orientation is stand
    * flat shape - shape of the token
        - box
        - circle
* shape properties
    * shape type
        - cube
        - box
        - circle
        - mesh // a specific mesh name to use

The main **Actions** that can be performed on a piece are:
* move - the piece can be picked up from the map and moved to another location.
* flip - a flat token can be flipped over.
* knockdown - place a standee flat.
* rotate - a dial or a standee's orientation on the board


There are 2 additional special type of pieces that's common for board games, **Deck** and **Dice**

A Deck is a special kind of piece that contains other pieces. The Deck can be manipulated as one object, but it can also be split and draw cards from. It bascially allow a collection of pieces to be manipulated in an easy way.

A deck is specific by the following 
* default_card_back - all cards in the deck have the same back unless otherwise specified
* a list of images for the cards
* shape - usually a rectangle
    - width and height if rectangle

Here are a list of actions for a deck
* shuffle
* draw from top
* draw from bottom
* split X piles
* place cards on top

A deck can specify exactly which operations are allowed. Such as discard piles only allow cards to be placed face up or down.

Deck should also be placed at a certain location on the board.

Each player can have a **Hand** which is contains a list of cards that only the player can see. The list is ordered so the player can arrange the cards however they like but others won't be able to see that occur. When a deck is drawn, the card is added to the player's hand. Card can also be placed onto the board. It can be placed into a deck, on top, or on bottom.