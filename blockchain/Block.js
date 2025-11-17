const crypto = require('crypto');

/**
 * Block class represents a single block in the blockchain
 * Contains all mandatory fields: index, timestamp, transactions, prev_hash, nonce, hash
 */
class Block {
    constructor(index, timestamp, transactions, prev_hash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions; // Can be attendance data, student info, class info, or department info
        this.prev_hash = prev_hash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    /**
     * Calculate SHA-256 hash of the block
     * Hash includes: timestamp, transactions, prev_hash, and nonce
     */
    calculateHash() {
        const data = this.index + 
                     this.timestamp + 
                     JSON.stringify(this.transactions) + 
                     this.prev_hash + 
                     this.nonce;
        
        return crypto.createHash('sha256').update(data).digest('hex');
    }

    /**
     * Proof of Work implementation
     * Mine until hash starts with difficulty prefix (e.g., "0000")
     */
    mineBlock(difficulty) {
        const target = '0'.repeat(difficulty);
        
        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        
        console.log(`Block mined: ${this.hash} (nonce: ${this.nonce})`);
    }
}

module.exports = Block;
