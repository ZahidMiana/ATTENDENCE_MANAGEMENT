const Block = require('./Block');

/**
 * Base Blockchain class with core validation logic
 */
class Blockchain {
    constructor(chainName = 'Generic Chain') {
        this.chain = [];
        this.difficulty = 4; // Hash must start with "0000"
        this.chainName = chainName;
    }   

    /**
     * Get the latest block in the chain
     */
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    /**
     * Get the latest hash (used by child chains)
     */
    getLatestHash() {
        if (this.chain.length === 0) {
            return '0'; // Default if no blocks exist
        }
        return this.getLatestBlock().hash;
    }

    /**
     * Add a new block to the chain
     */
    addBlock(newBlock) {
        // Mine the block with PoW
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    /**
     * Create genesis block
     */
    createGenesisBlock(transactions, parentHash = '0') {
        const genesis = new Block(0, Date.now(), transactions, parentHash);
        genesis.mineBlock(this.difficulty);
        this.chain.push(genesis);
        return genesis;
    }

    /**
     * Validate the entire blockchain
     * Checks:
     * 1. Each block's hash is correctly calculated
     * 2. Each block's prev_hash matches the previous block's hash
     * 3. PoW is valid (hash starts with required zeros)
     */
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Recalculate hash to check if block was tampered with
            const recalculatedHash = currentBlock.calculateHash();
            if (currentBlock.hash !== recalculatedHash) {
                console.log(`Invalid hash at block ${i}`);
                return false;
            }

            // Check if prev_hash matches
            if (currentBlock.prev_hash !== previousBlock.hash) {
                console.log(`Invalid prev_hash link at block ${i}`);
                return false;
            }

            // Verify PoW
            if (!currentBlock.hash.startsWith('0'.repeat(this.difficulty))) {
                console.log(`Invalid PoW at block ${i}`);
                return false;
            }
        }

        // Validate genesis block
        if (this.chain.length > 0) {
            const genesis = this.chain[0];
            if (genesis.hash !== genesis.calculateHash()) {
                console.log('Invalid genesis block hash');
                return false;
            }
            if (!genesis.hash.startsWith('0'.repeat(this.difficulty))) {
                console.log('Invalid genesis block PoW');
                return false;
            }
        }

        return true;
    }

    /**
     * Get all blocks
     */
    getAllBlocks() {
        return this.chain;
    }

    /**
     * Get block by index
     */
    getBlock(index) {
        return this.chain[index];
    }

    /**
     * Get chain length
     */
    getChainLength() {
        return this.chain.length;
    }
}

module.exports = Blockchain;
