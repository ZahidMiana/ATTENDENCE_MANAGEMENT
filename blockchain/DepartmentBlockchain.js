const Blockchain = require('./Blockchain');
const Block = require('./Block');

/**
 * Layer 1: Department Blockchain
 * Independent chain for each department
 * Genesis block is tied only to the department
 */
class DepartmentBlockchain extends Blockchain {
    constructor(departmentId, departmentName) {
        super(`Department: ${departmentName}`);
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        
        // Create genesis block for department
        this.createGenesisBlock({
            type: 'DEPARTMENT_GENESIS',
            departmentId: this.departmentId,
            departmentName: this.departmentName,
            action: 'CREATED',
            timestamp: Date.now()
        });
    }

    /**
     * Add a department - creates a new block (for initial creation or adding new dept)
     */
    addDepartment(departmentData) {
        const newBlock = new Block(
            this.chain.length,
            Date.now(),
            {
                type: 'DEPARTMENT_ADD',
                departmentId: this.departmentId,
                departmentName: this.departmentName,
                data: departmentData,
                action: 'CREATED',
                timestamp: Date.now()
            },
            this.getLatestHash()
        );
        
        this.addBlock(newBlock);
        return newBlock;
    }

    /**
     * Update department - no blocks are modified, new block is added with updated data
     */
    updateDepartment(updatedData) {
        const newBlock = new Block(
            this.chain.length,
            Date.now(),
            {
                type: 'DEPARTMENT_UPDATE',
                departmentId: this.departmentId,
                previousName: this.departmentName,
                updatedData: updatedData,
                action: 'UPDATED',
                timestamp: Date.now()
            },
            this.getLatestHash()
        );
        
        this.addBlock(newBlock);
        
        // Update current reference (metadata only, chain remains immutable)
        if (updatedData.departmentName) {
            this.departmentName = updatedData.departmentName;
        }
        
        return newBlock;
    }

    /**
     * Delete department - soft delete by adding a block with status: "deleted"
     * Previous blocks remain intact
     */
    deleteDepartment() {
        const newBlock = new Block(
            this.chain.length,
            Date.now(),
            {
                type: 'DEPARTMENT_DELETE',
                departmentId: this.departmentId,
                departmentName: this.departmentName,
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
     * Get current department status
     * Returns the most recent status by checking the latest blocks
     */
    getCurrentStatus() {
        if (this.chain.length === 0) {
            return { status: 'non-existent' };
        }

        // Check from latest to oldest
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
            departmentId: this.departmentId,
            departmentName: this.departmentName,
            status: 'active'
        };

        // Collect all updates
        for (let i = 1; i < this.chain.length; i++) {
            const block = this.chain[i];
            if (block.transactions.type === 'DEPARTMENT_UPDATE' && block.transactions.updatedData) {
                latestData = { ...latestData, ...block.transactions.updatedData };
            }
        }

        return latestData;
    }

    /**
     * Get department history (all blocks)
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

module.exports = DepartmentBlockchain;
