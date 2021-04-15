pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MerchToken is ERC721, Ownable {
    /*** EVENTS ***/
    /// The event emitted (useable by web3) when a token is purchased
    event MerchToken(address indexed buyer, uint256 tokenId);

    /*** CONSTANTS ***/
    uint8 constant NAME_MIN_LENGTH = 1;
    uint8 constant NAME_MAX_LENGTH = 64;
    string constant public merchTypes = "SHIRT,SOCKS,BACKPACK,PANTS,BRICK";
    string constant public tags = "COOL,SICK,SEXY,CRINGE,CLOUTED,INSANE,COZY,SAD,LEGIT,GOBEARS";

    /*** DATA S ***/
    struct MerchInfo {
        uint256 price;
        string name;
        string picture;
        string description;
        uint256 merchType;
        uint256 tag;
        bool forSale;
    }

    //This mapping is from the tokens that exist in the contract to
    //a relevant MerchInfo struct containing the token's properties
    mapping(uint256 => MerchInfo) tokenInfos;

    // The next token id to be issued. Every time a token is minted, index
    // increases by 1.
    uint256 index;

    constructor() public ERC721("Merch Token", "OSKI") {
        // any init code when you deploy the contract would run here

        //initialize contract with no tokens
        index = 0;
    }

    /* Requires the amount of Ether be at least or more of the currentPrice
     * @dev Creates an instance of an token and mints it to the purchaser.
     *
     * the default ERC721 Requires gas to mint, but we modified
     * it to mint for free and have a price set by the user*/
    function mintToken(
        uint256 _price,
        string calldata _name,
        string calldata _picture,
        string calldata _description,
        bool _forSale
    ) external payable {
        bytes memory _nameBytes = bytes(_name);
        require(_price > 0, "Price must be greater than 0");
        require(bytes(_picture).length != 0, "you need a picture");
        require(
            bytes(_description).length != 0,
            "Description should not be null"
        );
        require(_nameBytes.length >= NAME_MIN_LENGTH, "Title is too short");
        require(_nameBytes.length <= NAME_MAX_LENGTH, "Title is too long");

        // ***********TO DO:*************  Generate psedorandom numbers
        // by running blocktimestamp+address -> blackbox hashing function -> determine from last digit of result
        bytes32 hash1 = 
        bytes32 hash2 = 
        uint256 result = uint256(hash2);

        uint256 _merchType = 
        uint256 _tag = 

        require(_tag <= 4, "Failed random check, ID too large");
        require(_merchType <= 9, "Failed random check, tagID too large");

        _mint(msg.sender, index);

        tokenInfos[index] = MerchInfo({
            price: _price,
            name: _name,
            picture: _picture,
            description: _description,
            merchType: _merchType,
            tag: _tag,
            forSale: _forSale
        });

        //*****TO:DO****** once a token is minted, tell the contract by changing one variable
        

        emit MerchToken(msg.sender, index);
    }

    function buyToken(uint256 _id) external payable {
        require(tokenInfos[_id].price > 0); // ensure token exists
        require(msg.value >= tokenInfos[_id].price); // ensure enough money paid for token
        require(tokenInfos[_id].forSale == true); // ensure for sale

        //pay with eth
        bool sent = payable(ownerOf(_id)).send(msg.value);
        require(sent, "Failed to send Ether");

        //transfer the NFT
        _transfer(ownerOf(_id), msg.sender, _id);
        tokenInfos[_id].forSale = false;
    }

    // Returns the number of tokens issued so far
    function getTokens() public returns (uint256) {
        return index;
    }

    /* @notice Returns all the relevant information about a specific token
     * @param _tokenId The ID of the token of interest */
    function getToken(uint256 _tokenId)
        external
        view
        returns (
            string memory _name,
            string memory _picture,
            string memory _description,
            uint256[3] memory _ints, //price, tag, and type are stored as ints in this array
            bool _forSale
        )
    {
        require(_tokenId < index); // ensure token exists

        _name = tokenInfos[_tokenId].name;
        _picture = tokenInfos[_tokenId].picture;
        _description = tokenInfos[_tokenId].description;

        _ints[0] = (tokenInfos[_tokenId].price);
        _ints[1] = (tokenInfos[_tokenId].merchType);
        _ints[2] = (tokenInfos[_tokenId].tag);

        _forSale = tokenInfos[_tokenId].forSale;
    }

    //******TO DO************
    // Changes the price that must be paid to buy a particular token
    function changePrice(uint256 _tokenId, uint256 _newPrice) public {

    }

    // Allow a token to be sold
    function listToken(uint256 _tokenId) public {
        require(ownerOf(_tokenId) == msg.sender);
        require(!tokenInfos[_tokenId].forSale);
        tokenInfos[_tokenId].forSale = true;
    }

    // Disallow a token to be sold
    function unListToken(uint256 _tokenId) public {
        require(ownerOf(_tokenId) == msg.sender);
        require(tokenInfos[_tokenId].forSale);
        tokenInfos[_tokenId].forSale = false;
    }
}
