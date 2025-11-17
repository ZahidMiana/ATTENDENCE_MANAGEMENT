const Blockchain = require('./Blockchain');
const Block = require('./Block');

/**
 * Layer 2: Class Blockchain (Child of Department Chain)
 * Each class inside a department spawns its own blockchain
 * Genesis block uses department's latest block hash as prev_hash
 */
class ClassBlockchain extends Blockchain {
    constructor(classId, className, departmentId, departmentLatestHash) {
        super(`Class: ${className}`);
        this.classId = classId;
        this.className = className;
        this.departmentId = departmentId;
        
        // Create genesis block with parent department's latest hash
        this.createGenesisBlock({
            type: 'CLASS_GENESIS',
            classId: this.classId,
            className: this.className,
            departmentId: this.departmentId,
            action: 'CREATED',
            timestamp: Date.now()
        }, departmentLatestHash); // Key: uses parent department's hash
    }

    /**
     * Add class data
     */
    addClass(classData) {
        const newBlock = new Block(
            this.chain.length,
            Date.now(),
            {
                type: 'CLASS_ADD',
                classId: this.classId,
                className: this.className,
                departmentId: this.departmentId,
                data: classData,
                action: 'CREATED',
                timestamp: Date.now()
            },
            this.getLatestHash()
        );
        
        this.addBlock(newBlock);
        return newBlock;
    }

    /**
     * Update class - adds new block with updated data
     * Previous blocks remain intact
     */
    updateClass(updatedData) {
        const newBlock = new Block(
            this.chain.length,
            Date.now(),
            {
                type: 'CLASS_UPDATE',
                classId: this.classId,
                previousName: this.className,
                updatedData: updatedData,
                action: 'UPDATED',
                timestamp: Date.now()
            },
            this.getLatestHash()
        );
        
        this.addBlock(newBlock);
        
        // Update metadata
        if (updatedData.className) {
            this.className = updatedData.className;
        }
        
        return newBlock;
    }

    /**
     * Delete class - soft delete with status: "deleted"
     */
    deleteClass() {
        const newBlock = new Block(
            this.chain.length,
            Date.now(),
            {
                type: 'CLASS_DELETE',
                classId: this.classId,
                className: this.className,
                departmentId: this.departmentId,
                status: 'deleted',
                action: 'DELETED',
                timestamp: Date.now()
            },
            this.getLatestHash()
        );
        
        this.addBlock(newBlock);
        return newBlock;
    }

    /**
     * Get current class status
     */
    getCurrentStatus() {
        if (this.chain.length === 0) {
            return { status: 'non-existent' };
        }

        // Check for deletion
        for (let i = this.chain.length - 1; i >= 0; i--) {
            const block = this.chain[i];
            
            if (block.transactions.status === 'deleted') {
                return { 
                    status: 'deleted', 
                    deletedAt: block.timestamp,
                    blockIndex: block.index 
                };
            }
        }

        // Get latest data
        let latestData = {
            classId: this.classId,
            className: this.className,
            departmentId: this.departmentId,
            status: 'active'
        };

        // Apply updates
        for (let i = 1; i < this.chain.length; i++) {
            const block = this.chain[i];
            if (block.transactions.type === 'CLASS_UPDATE' && block.transactions.updatedData) {
                latestData = { ...latestData, ...block.transactions.updatedData };
            }
        }

        return latestData;
    }

    /**
     * Verify that genesis block is correctly linked to parent department
     */
    verifyParentLink(expectedParentHash) {
        if (this.chain.length === 0) return false;
        
        const genesis = this.chain[0];
        return genesis.prev_hash === expectedParentHash;
    }

    /**
     * Get class history
     */
    getHistory() {
        return this.chain.map(block => ({
            index: block.index,
            timestamp: block.timestamp,
            transactions: block.transactions,
            hash: block.hash,
            prev_hash: block.prev_hash,
            nonce: block.nonce
        }));
    }
}

module.exports = ClassBlockchain;
